import { Field, InputType, Int } from 'type-graphql';
import { prisma } from '../prisma';
import { getUserIdTypeORM } from '../user';
import assert from 'assert';
import { getUserForTypeORM } from '../user';
import { lecture_appointmenttype_enum } from '../../graphql/generated';
import { createZoomMeeting } from '../zoom/zoom-scheduled-meeting';
import { createZoomUser, getZoomUser } from '../zoom/zoom-user';
import { student } from '@prisma/client';
import moment from 'moment';
import { getLogger } from '../../common/logger/logger';

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

export const createMatchAppointments = async (matchId: number, appointmentsToBeCreated: AppointmentCreateMatchInput[]) => {
    const { pupil, student } = await prisma.match.findUniqueOrThrow({ where: { id: matchId }, include: { student: true, pupil: true } });
    const studentUserId = getUserIdTypeORM(student);
    const pupilUserId = getUserIdTypeORM(pupil);
    const hosts = [student];

    const videoChat = await createZoomMeetingForAppointments(hosts, appointmentsToBeCreated, false);
    logger.info(`Zoom - Created meeting ${videoChat.id} for match ${matchId} with ${appointmentsToBeCreated.length} appointments`);

    return await Promise.all(
        appointmentsToBeCreated.map(
            async (appointmentToBeCreated) =>
                await prisma.lecture.create({
                    data: {
                        title: appointmentToBeCreated.title,
                        description: appointmentToBeCreated.description,
                        start: appointmentToBeCreated.start,
                        duration: appointmentToBeCreated.duration,
                        matchId: appointmentToBeCreated.matchId,
                        appointmentType: lecture_appointmenttype_enum.match,
                        organizerIds: [studentUserId],
                        participantIds: [pupilUserId],
                        zoomMeetingId: videoChat.id.toString(),
                    },
                })
        )
    );
};

export const createGroupAppointments = async (subcourseId: number, appointmentsToBeCreated: AppointmentCreateGroupInput[]) => {
    const participants = await prisma.subcourse_participants_pupil.findMany({ where: { subcourseId: subcourseId }, select: { pupil: true } });
    const instructors = await prisma.subcourse_instructors_student.findMany({ where: { subcourseId: subcourseId }, select: { student: true } });
    assert(instructors.length > 0, `No instructors found for subcourse ${subcourseId} there must be at least one organizer for an appointment`);
    const hosts = instructors.map((i) => i.student);

    const videoChat = await createZoomMeetingForAppointments(hosts, appointmentsToBeCreated, true);

    return await Promise.all(
        appointmentsToBeCreated.map(
            async (appointmentToBeCreated) =>
                await prisma.lecture.create({
                    data: {
                        title: appointmentToBeCreated.title,
                        description: appointmentToBeCreated.description,
                        start: appointmentToBeCreated.start,
                        duration: appointmentToBeCreated.duration,
                        subcourseId: appointmentToBeCreated.subcourseId,
                        appointmentType: lecture_appointmenttype_enum.group,
                        organizerIds: instructors.map((i) => getUserForTypeORM(i.student).userID),
                        participantIds: participants.map((p) => getUserForTypeORM(p.pupil).userID),
                        zoomMeetingId: videoChat.id.toString(),
                    },
                })
        )
    );
};

const createZoomMeetingForAppointments = async (
    students: student[],
    appointmentsToBeCreated: AppointmentCreateMatchInput[] | AppointmentCreateGroupInput[],
    isCourse: boolean
) => {
    try {
        if (appointmentsToBeCreated.length === 0) {
            return;
        }
        const appointmentsNumber = appointmentsToBeCreated.length;
        const lastDate = appointmentsToBeCreated[appointmentsNumber - 1].start;

        const studentZoomUsers = await Promise.all(
            students.map(async (student) => {
                const existingUser = await getZoomUser(student.email);
                if (existingUser) {
                    return existingUser;
                }
                const studentZoomUser = await createZoomUser(student);
                return studentZoomUser;
            })
        );

        const newVideoChat =
            appointmentsNumber > 1
                ? await createZoomMeeting(studentZoomUsers, appointmentsToBeCreated[0].start, isCourse, lastDate)
                : await createZoomMeeting(studentZoomUsers, appointmentsToBeCreated[0].start, isCourse);

        return newVideoChat;
    } catch (e) {
        throw new Error(`Zoom - Error while creating zoom meeting: ${e}`);
    }
};
