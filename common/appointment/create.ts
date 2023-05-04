import { Field, InputType, Int } from 'type-graphql';
import { prisma } from '../prisma';
import { getUserIdTypeORM } from '../user';
import assert from 'assert';
import { getUserForTypeORM } from '../user';
import { lecture_appointmenttype_enum } from '../../graphql/generated';
import moment from 'moment';

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

const isAppointmentOneWeekLater = (datestring: Date) => {
    const now = moment.now();
    const start = moment(datestring);
    const diffDays = start.diff(now, 'days');
    if (diffDays >= 6) {
        return true;
    }
    return false;
};

const isAppointmentFiveMinutesLater = (datestring: Date) => {
    const now = moment.now();
    const start = moment(datestring);
    const same = start.isSame(now, 'date');
    const after = start.isAfter(now);
    if (same) {
        const diff = start.diff(now, 'minutes');
        if (diff >= 5) {
            return true;
        }
    } else if (after) {
        return true;
    }

    return false;
};

export const createMatchAppointments = async (matchId: number, appointmentsToBeCreated: AppointmentCreateMatchInput[]) => {
    const { pupil, student } = await prisma.match.findUniqueOrThrow({ where: { id: matchId }, include: { student: true, pupil: true } });
    const studentUserId = getUserIdTypeORM(student);
    const pupilUserId = getUserIdTypeORM(pupil);

    return await Promise.all(
        appointmentsToBeCreated.map(async (appointmentToBeCreated) => {
            if (isAppointmentFiveMinutesLater(appointmentToBeCreated.start)) {
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
                    },
                });
            } else {
                throw new Error('Appointment can not be created if start time is less than five minutes.');
            }
        })
    );
};

export const createGroupAppointments = async (subcourseId: number, appointmentsToBeCreated: AppointmentCreateGroupInput[]) => {
    const participants = await prisma.subcourse_participants_pupil.findMany({ where: { subcourseId: subcourseId }, select: { pupil: true } });
    const instructors = await prisma.subcourse_instructors_student.findMany({ where: { subcourseId: subcourseId }, select: { student: true } });
    assert(instructors.length > 0, `No instructors found for subcourse ${subcourseId} there must be at least one organizer for an appointment`);
    return await Promise.all(
        appointmentsToBeCreated.map(async (appointmentToBeCreated) => {
            if (isAppointmentOneWeekLater(appointmentToBeCreated.start)) {
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
                    },
                });
            } else {
                throw new Error('Appointment can not be created, because start is not one week later.');
            }
        })
    );
};
