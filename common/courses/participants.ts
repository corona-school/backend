import { course as Course, subcourse as Subcourse, pupil as Pupil } from "@prisma/client";
import { sendParticipantRegistrationConfirmationMail } from "../mails/courses";
import { getTransactionLog } from "../transactionlog";
import ParticipantJoinedCourseEvent from "../transactionlog/types/ParticipantJoinedCourseEvent";
import { getLogger } from "log4js";
import { prisma } from "../prisma";
import ParticipantLeftCourseEvent from "../transactionlog/types/ParticipantLeftCourseEvent";
import moment from "moment";
import { sendTemplateMail, mailjetTemplates } from "../mails";
import * as Notification from "../notification";
import { hasStarted } from "./states";

const delay = (time: number) => new Promise(res => setTimeout(res, time));

const subcourseLock = new Set<Course["id"]>();
const pupilLock = new Set<Pupil["id"]>();

const BUSY_WAIT_TIME = 100;
const BUSY_SPIN = 10;
const PUPIL_MAX_SUBCOURSES = 5;

const logger = getLogger("Course");

/* The subcourse-pupil-lock needs to be used when multiple users could get into a conflict on the database.
   The only thing where that is currently the case is joining a course, as the number of participants is limited.
   This consistency guarantee cannot be enforced on database level and thus we need to synchronize on application level */
async function acquireLock<T>(subcourse: Subcourse, pupil: Pupil, transaction: () => Promise<T>): Promise<T> {
    let waitCount = BUSY_SPIN;

    // WAIT
    while (subcourseLock.has(subcourse.id) || pupilLock.has(pupil.id)) {
        if (waitCount-- <= 0) {
            throw new Error(`Busy lock failed to acquire after ${BUSY_SPIN}x ${BUSY_WAIT_TIME}ms`);
        }

        logger.debug(`Lock waiting for Subcourse(${subcourse.id}) and Pupil(${pupil.id})`);
        await delay(BUSY_WAIT_TIME);
    }

    // ACQUIRE
    try {
        subcourseLock.add(subcourse.id);
        pupilLock.add(pupil.id);
        logger.debug(`Acquired Lock for Subcourse(${subcourse.id}) and Pupil(${pupil.id})`);

        return await transaction();
    } finally {
        // RELEASE
        subcourseLock.delete(subcourse.id);
        pupilLock.delete(pupil.id);
        logger.debug(`Released Lock for Subcourse(${subcourse.id}) and Pupil(${pupil.id})`);
    }
}

export async function joinSubcourseWaitinglist(subcourse: Subcourse, pupil: Pupil) {
    if (await hasStarted(subcourse)) {
        throw new Error(`Subourse has already started, cannot join waiting list`);
    }

    try {
        await prisma.subcourse_waiting_list_pupil.create({
            data: { pupilId: pupil.id, subcourseId: subcourse.id }
        });
    } catch (error) {
        throw new Error(`Failed to join waiting list, pupil is already on it`);
    }
}

export async function leaveSubcourseWaitinglist(subcourse: Subcourse, pupil: Pupil, force = true) {
    const waitingListDeletion = await prisma.subcourse_waiting_list_pupil.deleteMany({
        where: {
            pupilId: pupil.id,
            subcourseId: subcourse.id
        }
    });

    if (waitingListDeletion.count === 1) {
        logger.info(`Removed Pupil(${pupil.id}) from waiting list of Subcourse(${subcourse.id})`);
    } else if (force) {
        throw new Error(`Pupil is not on the waiting list`);
    }
}

export async function joinSubcourse(subcourse: Subcourse, pupil: Pupil): Promise<void> {
    await acquireLock(subcourse, pupil, async () => {
        const participantCount = await prisma.subcourse_participants_pupil.count({ where: { subcourseId: subcourse.id }});
        logger.debug(`Found ${participantCount} participants for Subcourse(${subcourse.id}) with ${subcourse.maxParticipants} max participants`);

        if (participantCount > subcourse.maxParticipants) {
            throw new Error(`Subcourse is full`);
        }

        const firstLecture = await prisma.lecture.findMany({
            where: { subcourseId: subcourse.id },
            orderBy: { start: "asc" },
            take: 1
        });

        if (firstLecture.length !== 1) {
            throw new Error("Subcourse has no lectures");
        }

        if (firstLecture[0].start < new Date() && !subcourse.joinAfterStart) {
            throw new Error("Subcourse already started");
        }

        const pupilSubCourseCount = await prisma.subcourse_participants_pupil.count({
            where: {
                pupilId: pupil.id,
                subcourse: {
                    lecture: {
                        every: {
                            start: { lte: new Date() }
                        }
                    }
                }
            }
        });
        logger.debug(`Found ${pupilSubCourseCount} active subcourses where the Pupil(${pupil.id}) participates`);

        if (pupilSubCourseCount > PUPIL_MAX_SUBCOURSES) {
            throw new Error(`Pupil already has joined ${pupilSubCourseCount} courses`);
        }

        await leaveSubcourseWaitinglist(subcourse, pupil, /* force: */ false);

        const insertion = await prisma.subcourse_participants_pupil.create({
            data: {
                pupilId: pupil.id,
                subcourseId: subcourse.id
            }
        });

        if (insertion === null) {
            throw new Error("Failed to join Subcourse");
        }

        logger.info(`Pupil(${pupil.id}) joined Subcourse(${subcourse.id}`);

        try {
            const course = await prisma.course.findUnique({ where: { id: subcourse.courseId }});
            const courseStart = moment(firstLecture[0].start);

            /* TODO: Deprecate usage of old mailjet templates */
            const mail = mailjetTemplates.COURSESPARTICIPANTREGISTRATIONCONFIRMATION({
                participantFirstname: pupil.firstname,
                courseName: course.name,
                courseId: String(course.id),
                firstLectureDate: courseStart.format("DD.MM.YYYY"),
                firstLectureTime: courseStart.format("HH:mm"),
                authToken: pupil.authToken
            });

            await sendTemplateMail(mail, pupil.email);

            await Notification.actionTaken(pupil, "participant_subcourse_joined", {
                course,
                firstLectureDate: courseStart.format("DD.MM.YYYY"),
                firstLectureTime: courseStart.format("HH:mm")
            });
        } catch (error) {
            logger.warn(`Failed to send confirmation mail for Subcourse(${subcourse.id}) however the Pupil(${pupil.id}) still joined the course`);
        }

        try {
            const transactionLog = getTransactionLog();
            await transactionLog.log(new ParticipantJoinedCourseEvent(pupil, subcourse));
        } catch (error) {
            logger.warn(`Failed to add ParticipationJoinedCourseEvent to transaction log, but pupil still joined the course`, error);
        }
    });
}

export async function leaveSubcourse(subcourse: Subcourse, pupil: Pupil) {
    // As we only delete, locking is not necessary
    const deletion = await prisma.subcourse_participants_pupil.deleteMany({
        where: {
            subcourseId: subcourse.id,
            pupilId: pupil.id
        }
    });

    if (deletion.count !== 1) {
        throw new Error(`Failed to leave Subcourse as the Pupil is not a participant`);
    }

    logger.info(`Pupil(${pupil.id}) left Subcourse(${subcourse.id})`);

    try {
        const transactionLog = getTransactionLog();
        await transactionLog.log(new ParticipantLeftCourseEvent(pupil, subcourse));
    } catch (error) {
        logger.warn(`Failed to add ParticpationLeftCourseEvent to transaction log, but pupil still left the subcourse`);
    }

    const course = prisma.course.findUnique({ where: { id: subcourse.courseId }});

    await Notification.actionTaken(pupil, "participant_subcourse_leave", {
        course
    });
}