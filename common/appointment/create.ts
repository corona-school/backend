import { Field, InputType, Int } from 'type-graphql';
import { prisma } from '../prisma';
import assert from 'assert';
import { Lecture, lecture_appointmenttype_enum } from '../../graphql/generated';
import { createZoomMeeting, getZoomMeetingReport } from '../zoom/scheduled-meeting';
import { ZoomUser, createZoomUser, getOrCreateZoomUser, getZoomUser } from '../zoom/user';
import { Prisma, student as Student, lecture as Appointment } from '@prisma/client';
import moment from 'moment';
import { getLogger } from '../../common/logger/logger';
import { isZoomFeatureActive } from '../zoom/util';
import * as Notification from '../../common/notification';
import { getNotificationContextForSubcourse } from '../mails/courses';
import { User, getStudentsFromList, userForPupil, userForStudent } from '../user';
import { getLecture, getMatch, getPupil, getStudent } from '../../graphql/util';
import { PrerequisiteError, RedundantError } from '../../common/util/error';
import { AppointmentType } from '../../common/entity/Lecture';

const logger = getLogger();

@InputType()
export abstract class AppointmentCreateInputBase {
    @Field({ nullable: true })
    title?: string;
    @Field({ nullable: true })
    description?: string;
    @Field()
    start: Date;
    @Field()
    duration: number;
    @Field({ nullable: true })
    meetingLink?: string;
}

@InputType()
export abstract class AppointmentCreateMatchInput extends AppointmentCreateInputBase {
    @Field(() => Int)
    matchId: number;
    @Field(() => lecture_appointmenttype_enum)
    appointmentType: 'match';
}

@InputType()
export abstract class AppointmentCreateGroupInput extends AppointmentCreateInputBase {
    @Field(() => Int, { nullable: false })
    subcourseId: number;
    @Field(() => lecture_appointmenttype_enum)
    appointmentType: 'group';
}

export const isAppointmentOneWeekLater = (appointmentDate: Date) => {
    const now = moment().startOf('day');
    const start = moment(appointmentDate).startOf('day');
    const diffDays = start.diff(now, 'days');
    return diffDays > 6;
};

export const createMatchAppointments = async (matchId: number, appointmentsToBeCreated: AppointmentCreateMatchInput[], silent: boolean = false) => {
    const { pupil, student } = await prisma.match.findUniqueOrThrow({ where: { id: matchId }, include: { student: true, pupil: true } });
    const studentUserId = userForStudent(student).userID;
    const pupilUserId = userForPupil(pupil).userID;
    const hosts = await hostsForStudents([student]);

    const createdMatchAppointments = await Promise.all(
        appointmentsToBeCreated.map(async (appointmentToBeCreated) => {
            let zoomMeetingId: string | null;
            if (isZoomFeatureActive()) {
                const videoChat = await createZoomMeetingForAppointmentWithHosts(hosts, appointmentToBeCreated, false);
                logger.info(`Zoom - Created meeting ${videoChat.id} for match ${matchId}`);
                zoomMeetingId = videoChat.id.toString();
            }
            return await prisma.lecture.create({
                data: {
                    title: appointmentToBeCreated.title,
                    description: appointmentToBeCreated.description,
                    start: appointmentToBeCreated.start,
                    duration: appointmentToBeCreated.duration,
                    matchId: appointmentToBeCreated.matchId,
                    appointmentType: lecture_appointmenttype_enum.match,
                    organizerIds: [studentUserId],
                    participantIds: [pupilUserId],
                    zoomMeetingId,
                },
            });
        })
    );

    if (!silent) {
        await Notification.actionTaken(userForPupil(pupil), 'student_add_appointment_match', {
            student,
            matchId: matchId.toString(),
        });
    }

    return createdMatchAppointments;
};

export const createGroupAppointments = async (subcourseId: number, appointmentsToBeCreated: AppointmentCreateGroupInput[], organizer: Student) => {
    const participants = await prisma.subcourse_participants_pupil.findMany({ where: { subcourseId: subcourseId }, select: { pupil: true } });
    const instructors = await prisma.subcourse_instructors_student.findMany({ where: { subcourseId: subcourseId }, select: { student: true } });
    const subcourse = await prisma.subcourse.findUnique({ where: { id: subcourseId }, include: { course: true } });

    assert(instructors.length > 0, `No instructors found for subcourse ${subcourseId} there must be at least one organizer for an appointment`);
    const hosts = await hostsForStudents(instructors.map((i) => i.student));

    const createdGroupAppointments = await Promise.all(
        appointmentsToBeCreated.map(async (appointmentToBeCreated) => {
            let zoomMeetingId: string | null;

            if (isZoomFeatureActive()) {
                const videoChat = await createZoomMeetingForAppointmentWithHosts(hosts, appointmentToBeCreated, true);
                logger.info(`Zoom - Created meeting ${videoChat.id} for subcourse ${subcourseId}`);
                zoomMeetingId = videoChat.id.toString();
            }

            return await prisma.lecture.create({
                data: {
                    title: appointmentToBeCreated.title,
                    description: appointmentToBeCreated.description,
                    start: appointmentToBeCreated.start,
                    duration: appointmentToBeCreated.duration,
                    subcourseId: appointmentToBeCreated.subcourseId,
                    appointmentType: lecture_appointmenttype_enum.group,
                    organizerIds: instructors.map((i) => userForStudent(i.student).userID),
                    participantIds: participants.map((p) => userForPupil(p.pupil).userID),
                    zoomMeetingId,
                },
            });
        })
    );

    // * send notification
    for (const participant of participants) {
        await Notification.actionTaken(userForPupil(participant.pupil), 'student_add_appointment_group', {
            student: organizer,
            ...(await getNotificationContextForSubcourse(subcourse.course, subcourse)),
        });
    }

    return createdGroupAppointments;
};

export async function createZoomMeetingForAppointment(appointment: Appointment) {
    if (!isZoomFeatureActive()) {
        throw new PrerequisiteError(`Zoom is not active`);
    }

    if (appointment.zoomMeetingId) {
        throw new RedundantError(`Appointment already has a Zoom Meeting`);
    }

    const hosts = await hostsForStudents(await getStudentsFromList(appointment.organizerIds));
    if (hosts.length !== appointment.organizerIds.length) {
        throw new PrerequisiteError(`Unsupported Organizer Types for Zoom Appointment`);
    }

    await createZoomMeetingForAppointmentWithHosts(hosts, appointment, appointment.appointmentType === AppointmentType.GROUP);
}

// Returns a Zoom User for each Student, if a Student does not have an account one is created
async function hostsForStudents(students: Student[]) {
    return await Promise.all(students.map(getOrCreateZoomUser));
}

const createZoomMeetingForAppointmentWithHosts = async (
    hosts: ZoomUser[],
    appointment: AppointmentCreateMatchInput | AppointmentCreateGroupInput | Appointment,
    isCourse: boolean
) => {
    try {
        const newVideoChat = await createZoomMeeting(hosts, appointment.start, appointment.duration, isCourse);
        return newVideoChat;
    } catch (error) {
        throw new Error(`Zoom - Error while creating zoom meeting: ${error}`);
    }
};

export const saveZoomMeetingReport = async (appointment: Lecture) => {
    const result = await getZoomMeetingReport(appointment.zoomMeetingId);

    await prisma.lecture.update({
        where: { id: appointment.id },
        data: { zoomMeetingReport: { push: result } },
    });

    logger.info(`Zoom meeting report was saved for appointment (${appointment.id})`);
};

export async function createAdHocMeeting(matchId: number, user: User) {
    const match = await getMatch(matchId);
    const { pupilId, studentId } = match;

    const pupil = await getPupil(pupilId);
    const student = await getStudent(studentId);

    const start = moment().toDate();

    const appointment: AppointmentCreateMatchInput[] = [
        {
            title: `Sofortbesprechung - ${pupil.firstname} und ${student.firstname} `,
            matchId: matchId,
            start: start,
            duration: 30,
            appointmentType: lecture_appointmenttype_enum.match,
        },
    ];

    // Silent as we trigger a dedicated notification action for it anyways
    const matchAppointment = await createMatchAppointments(matchId, appointment, /* silent */ true);
    const { id, appointmentType } = matchAppointment[0];

    await Notification.actionTaken(userForPupil(pupil), 'student_add_ad_hoc_meeting', {
        appointmentId: id.toString(),
        student: student,
        appointment: {
            url: `/video-chat/${id}/${appointmentType}`,
        },
    });

    return { id, appointmentType };
}
