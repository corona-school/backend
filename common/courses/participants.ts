import { course as Course, subcourse as Subcourse, pupil as Pupil } from '@prisma/client';
import { getLogger } from '../logger/logger';
import { prisma } from '../prisma';
import moment from 'moment';
import * as Notification from '../notification';
import { logTransaction } from '../transactionlog/log';
import { RedundantError, CapacityReachedError, PrerequisiteError } from '../util/error';
import { Decision } from '../util/decision';
import { gradeAsInt } from '../util/gradestrings';
import { createSecretEmailToken } from '../secret';
import { userForPupil, userForStudent } from '../user';
import { addGroupAppointmentsParticipant, removeGroupAppointmentsParticipant } from '../appointment/participants';
import { addParticipant } from '../chat';
import { ChatType } from '../chat/types';
import { isChatFeatureActive } from '../chat/util';
import { getCourseOfSubcourse, getSubcourseInstructors, removeSubcourseProspect } from './util';
import { getNotificationContextForSubcourse } from '../courses/notifications';

const delay = (time: number) => new Promise((res) => setTimeout(res, time));

const subcourseLock = new Set<Course['id']>();
const pupilLock = new Set<Pupil['id']>();

const BUSY_WAIT_TIME = 100;
const BUSY_SPIN = 10;
const PUPIL_MAX_SUBCOURSES = 10;

const logger = getLogger('Course');

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

export async function isParticipant(subcourse: Subcourse, pupil: Pupil) {
    return (
        (await prisma.subcourse_participants_pupil.count({
            where: { pupilId: pupil.id, subcourseId: subcourse.id },
        })) > 0
    );
}

export async function isOnWaitingList(subcourse: Subcourse, pupil: Pupil) {
    return (
        (await prisma.waiting_list_enrollment.count({
            where: { pupilId: pupil.id, subcourseId: subcourse.id },
        })) > 0
    );
}

export async function joinSubcourseWaitinglist(subcourse: Subcourse, pupil: Pupil) {
    if (await isParticipant(subcourse, pupil)) {
        throw new RedundantError(`Pupil is already participant`);
    }
    if (await isOnWaitingList(subcourse, pupil)) {
        throw new RedundantError('Pupil is already on waiting list');
    }

    try {
        await prisma.waiting_list_enrollment.create({
            data: {
                subcourseId: subcourse.id,
                pupilId: pupil.id,
            },
        });

        await logTransaction('participantJoinedWaitingList', userForPupil(pupil), { courseID: subcourse.id });
    } catch (error) {
        throw new RedundantError(`Failed to join waiting list, pupil is already on it`);
    }
}

export async function leaveSubcourseWaitinglist(subcourse: Subcourse, pupil: Pupil, force = true) {
    const queueEnrollmentDeletions = await prisma.waiting_list_enrollment.deleteMany({
        where: {
            pupilId: pupil.id,
            subcourseId: subcourse.id,
        },
    });

    if (queueEnrollmentDeletions.count > 0) {
        logger.info(`Removed Pupil(${pupil.id}) from waiting list of Subcourse(${subcourse.id})`);
        await logTransaction('participantLeftWaitingList', userForPupil(pupil), { courseID: subcourse.id });
        return true;
    } else if (force) {
        throw new RedundantError(`Pupil is not on the waiting list`);
    }

    return false;
}

type CourseDecision =
    | 'not-participant'
    | 'no-lectures'
    | 'subcourse-full'
    | 'grade-to-low'
    | 'grade-to-high'
    | 'already-started'
    | 'already-participant'
    | 'already-on-waitinglist';

export function canJoinSubcourses(pupil: Pupil): Decision<CourseDecision> {
    if (!pupil.isParticipant) {
        return { allowed: false, reason: 'not-participant' };
    }

    return { allowed: true };
}

export async function canJoinSubcourse(subcourse: Subcourse, pupil: Pupil): Promise<Decision<CourseDecision>> {
    const couldJoin = await couldJoinSubcourse(subcourse, pupil);
    if (!couldJoin.allowed) {
        return couldJoin;
    }

    const participants = await prisma.subcourse_participants_pupil.count({ where: { subcourseId: subcourse.id } });
    if (subcourse.maxParticipants <= participants) {
        return { allowed: false, reason: 'subcourse-full' };
    }
    return { allowed: true };
}

// Whether the pupil could join the course if the course was not full (i.e. pupils can still join the waitinglist)
export async function couldJoinSubcourse(subcourse: Subcourse, pupil: Pupil): Promise<Decision<CourseDecision>> {
    if (!canJoinSubcourses(pupil).allowed) {
        return canJoinSubcourses(pupil);
    }

    const firstLecture = await prisma.lecture.findMany({
        where: { subcourseId: subcourse.id },
        orderBy: { start: 'asc' },
        take: 1,
    });
    if (firstLecture.length !== 1) {
        return { allowed: false, reason: 'no-lectures' };
    }
    if (firstLecture[0].start < new Date() && !subcourse.joinAfterStart) {
        return { allowed: false, reason: 'already-started' };
    }
    if (await isParticipant(subcourse, pupil)) {
        return { allowed: false, reason: 'already-participant' };
    }

    const pupilGrade = gradeAsInt(pupil.grade);
    if (subcourse.minGrade && subcourse.minGrade > pupilGrade) {
        return { allowed: false, reason: 'grade-to-low' };
    }
    if (subcourse.maxGrade && pupilGrade > subcourse.maxGrade) {
        return { allowed: false, reason: 'grade-to-high' };
    }

    return { allowed: true };
}

export async function joinSubcourse(subcourse: Subcourse, pupil: Pupil, strict: boolean): Promise<void> {
    const canJoin = await canJoinSubcourse(subcourse, pupil);

    if (strict && !canJoin.allowed) {
        throw new PrerequisiteError(canJoin.reason);
    }

    await acquireLock(subcourse, pupil, async () => {
        const participantCount = await prisma.subcourse_participants_pupil.count({ where: { subcourseId: subcourse.id } });
        logger.debug(`Found ${participantCount} participants for Subcourse(${subcourse.id}) with ${subcourse.maxParticipants} max participants`);

        if (strict && participantCount > subcourse.maxParticipants) {
            throw new CapacityReachedError(`Subcourse is full`);
        }

        const pupilSubCourseCount = await prisma.subcourse_participants_pupil.count({
            where: {
                pupilId: pupil.id,
                subcourse: {
                    lecture: {
                        every: {
                            start: { gte: new Date() },
                        },
                    },
                },
            },
        });
        logger.debug(`Found ${pupilSubCourseCount} active subcourses where the Pupil(${pupil.id}) participates`);

        if (strict && pupilSubCourseCount > PUPIL_MAX_SUBCOURSES) {
            throw new CapacityReachedError(`Pupil already has joined ${pupilSubCourseCount} courses`);
        }

        const pupilUser = userForPupil(pupil);
        const leftWaitingList = await leaveSubcourseWaitinglist(subcourse, pupil, /* force: */ false);
        const leftProspects = await removeSubcourseProspect(subcourse.id, pupil.id);
        const insertion = await prisma.subcourse_participants_pupil.create({
            data: {
                pupilId: pupil.id,
                subcourseId: subcourse.id,
            },
        });

        if (insertion === null) {
            throw new Error('Failed to join Subcourse');
        }

        logger.info(`Pupil(${pupil.id}) joined Subcourse(${subcourse.id}`);
        await logTransaction('participantJoinedCourse', userForPupil(pupil), { subcourseID: subcourse.id });

        await addGroupAppointmentsParticipant(subcourse.id, pupilUser.userID);
        if (isChatFeatureActive() && subcourse.conversationId) {
            await addParticipant(pupilUser, subcourse.conversationId, subcourse.groupChatType as ChatType);
        }

        try {
            const course = await getCourseOfSubcourse(subcourse);

            const context = await getNotificationContextForSubcourse(course, subcourse);
            if (leftWaitingList) {
                await Notification.actionTaken(userForPupil(pupil), 'participant_course_joined_from_waitinglist', context);
            } else if (leftProspects) {
                await Notification.actionTaken(userForPupil(pupil), 'participant_course_joined_from_prospects', context);
            } else {
                await Notification.actionTaken(userForPupil(pupil), 'participant_course_joined_directly', context);
            }

            await Notification.actionTaken(userForPupil(pupil), 'participant_course_joined', {
                ...context,
                skipAchievementBucketsBefore: new Date().toISOString(),
            });
        } catch (error) {
            logger.error(`Failed to send confirmation mail for Subcourse(${subcourse.id}) however the Pupil(${pupil.id}) still joined the course`, error);
        }
    });

    // Notify instructors if the subcourse is full now
    const participantCountAfter = await prisma.subcourse_participants_pupil.count({ where: { subcourseId: subcourse.id } });
    if (participantCountAfter == subcourse.maxParticipants) {
        const context = await getNotificationContextForSubcourse(await getCourseOfSubcourse(subcourse), subcourse);

        for (const instructor of await getSubcourseInstructors(subcourse)) {
            await Notification.actionTaken(userForStudent(instructor), 'instructor_course_full', context);
        }
    }
}

export async function leaveSubcourse(subcourse: Subcourse, pupil: Pupil) {
    // As we only delete, locking is not necessary
    const deletion = await prisma.subcourse_participants_pupil.deleteMany({
        where: {
            subcourseId: subcourse.id,
            pupilId: pupil.id,
        },
    });

    const pupilUser = userForPupil(pupil);
    await removeGroupAppointmentsParticipant(subcourse.id, pupilUser.userID);

    if (deletion.count === 0) {
        throw new RedundantError(`Failed to leave Subcourse as the Pupil is not a participant`);
    }

    logger.info(`Pupil(${pupil.id}) left Subcourse(${subcourse.id})`);
    await logTransaction('participantLeftCourse', userForPupil(pupil), { subcourseID: subcourse.id });

    const course = await prisma.course.findUnique({ where: { id: subcourse.courseId } });

    await Notification.actionTaken(userForPupil(pupil), 'participant_course_leave', {
        course,
    });
}

export async function fillSubcourse(subcourse: Subcourse) {
    const participantCount = await prisma.subcourse_participants_pupil.count({ where: { subcourseId: subcourse.id } });
    const seatsLeft = subcourse.maxParticipants - participantCount;
    if (seatsLeft <= 0) {
        return;
    }

    logger.info(`Filling Subcourse(${subcourse.id}) with ${seatsLeft} seats left`);

    const toJoin = await prisma.waiting_list_enrollment.findMany({
        where: { subcourseId: subcourse.id },
        orderBy: { createdAt: 'asc' },
        take: seatsLeft,
        select: { pupil: true },
    });

    for (const { pupil } of toJoin) {
        try {
            await joinSubcourse(subcourse, pupil, true);
        } catch (error) {
            logger.warn(`Course filling - Failed to add Pupil(${pupil.id}) as:`, error);
        }
    }
}
