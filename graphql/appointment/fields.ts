import { AuthorizedDeferred, hasAccess, Role } from '../authorizations';
import { Arg, Authorized, Ctx, Field, FieldResolver, ObjectType, Resolver, Root, Int, Query } from 'type-graphql';
import { Lecture as Appointment } from '../generated';
import { GraphQLContext } from '../context';
import { getSessionStudent, getUserForSession, isElevated, isSessionStudent } from '../authentication';
import { LimitEstimated } from '../../graphql/complexity';
import { prisma } from '../../common/prisma';
import { getUserIdTypeORM, getUserType } from '../../common/user';
import { Deprecated } from '../../graphql/util';

@ObjectType()
class AppointmentParticipant {
    @Field((_type) => String, { nullable: true })
    userId: string;
    @Field((_type) => Int, { nullable: true })
    id: number;
    @Field((_type) => String, { nullable: true })
    firstname: string;
    @Field((_type) => String, { nullable: true })
    lastname: string;
    @Field((_type) => Boolean, { nullable: true })
    isStudent?: boolean;
    @Field((_type) => Boolean, { nullable: true })
    isPupil?: boolean;
    @Field((_type) => Boolean, { nullable: true })
    isScreener?: boolean;
}

@ObjectType()
class Organizer {
    @Field((_type) => String, { nullable: true })
    userId: string;
    @Field((_type) => Int)
    id: number;
    @Field((_type) => String)
    firstname: string;
    @Field((_type) => String)
    lastname: string;
    @Field((_type) => Boolean)
    isStudent: boolean;
}

@Resolver((of) => Appointment)
export class ExtendedFieldsLectureResolver {
    @Query((returns) => Appointment)
    @AuthorizedDeferred(Role.OWNER, Role.APPOINTMENT_PARTICIPANT)
    async appointment(@Ctx() context: GraphQLContext, @Arg('appointmentId') appointmentId: number) {
        const appointment = await prisma.lecture.findUniqueOrThrow({ where: { id: appointmentId } });
        await hasAccess(context, 'Lecture', appointment);
        return appointment;
    }

    @Deprecated('use isOrganizer instead')
    @FieldResolver((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.STUDENT)
    async isInstructor(@Ctx() context: GraphQLContext, @Root() appointment: Appointment, @Arg('studentId', { nullable: true }) studentId?: number) {
        const student = await getSessionStudent(context, studentId);
        return appointment.instructorId === student.id;
    }
    @FieldResolver((returns) => Boolean)
    @Authorized(Role.UNAUTHENTICATED)
    async isOrganizer(@Ctx() context: GraphQLContext, @Root() appointment: Appointment, @Arg('studentId', { nullable: true }) studentId?: number) {
        if (!isElevated(context) && !isSessionStudent(context)) {
            return false;
        }

        const student = await getSessionStudent(context, studentId);
        const isOrganizer = (await prisma.appointment_organizer.count({ where: { appointmentId: appointment.id, studentId: student.id } })) > 0;
        return isOrganizer;
    }
    @FieldResolver((returns) => Boolean)
    @Authorized(Role.USER)
    async isParticipant(@Ctx() context: GraphQLContext, @Root() appointment: Appointment) {
        const user = await getUserForSession(context.sessionToken);
        switch (getUserType(user)) {
            case 'pupil': {
                return (await prisma.appointment_participant_pupil.count({ where: { appointmentId: appointment.id, pupilId: user.pupilId } })) > 0;
            }
            case 'student': {
                return (await prisma.appointment_participant_student.count({ where: { appointmentId: appointment.id, studentId: user.studentId } })) > 0;
            }
            case 'screener': {
                return (await prisma.appointment_participant_screener.count({ where: { appointmentId: appointment.id, screenerId: user.screenerId } })) > 0;
            }
            default:
                throw new Error(`Cannot determine participation for user type: ${getUserType(user)}`);
        }
    }
    @FieldResolver((returns) => [AppointmentParticipant], { nullable: true })
    @Authorized(Role.OWNER, Role.APPOINTMENT_PARTICIPANT)
    @LimitEstimated(30)
    async participants(@Root() appointment: Appointment, @Arg('take', (type) => Int) take: number, @Arg('skip', (type) => Int) skip: number) {
        const participantPupils = (
            await prisma.pupil.findMany({
                where: {
                    appointment_participant_pupil: {
                        some: {
                            appointmentId: appointment.id,
                        },
                    },
                },
                take,
                skip,
                select: {
                    id: true,
                    firstname: true,
                    lastname: true,
                    isPupil: true,
                },
            })
        ).map((p) => ({ ...p, isPupil: true, userId: getUserIdTypeORM(p) }));
        const participantStudents = (
            await prisma.student.findMany({
                where: {
                    appointment_participant_student: {
                        some: {
                            appointmentId: appointment.id,
                        },
                    },
                },
                take,
                skip,
                select: {
                    id: true,
                    firstname: true,
                    lastname: true,
                    isStudent: true,
                },
            })
        ).map((p) => ({ ...p, isStudent: true, userId: getUserIdTypeORM(p) }));
        const participantScreener = (
            await prisma.screener.findMany({
                where: {
                    appointment_participant_screener: {
                        some: {
                            appointmentId: appointment.id,
                        },
                    },
                },
                take,
                skip,
                select: {
                    id: true,
                    firstname: true,
                    lastname: true,
                },
            })
        ).map((p) => ({ ...p, isScreener: true }));
        const participants = [...participantPupils, ...participantStudents, ...participantScreener];
        return participants;
    }

    @FieldResolver((returns) => [Organizer])
    @Authorized(Role.USER)
    @LimitEstimated(5)
    async organizers(@Root() appointment: Appointment, @Arg('take', (type) => Int) take: number, @Arg('skip', (type) => Int) skip: number) {
        return (
            await prisma.student.findMany({
                where: {
                    appointment_organizer: {
                        some: {
                            appointmentId: appointment.id,
                        },
                    },
                },
                take,
                skip,
                select: {
                    id: true,
                    firstname: true,
                    lastname: true,
                    isStudent: true,
                },
            })
        ).map((p) => ({ ...p, isStudent: true, userId: getUserIdTypeORM(p) }));
    }
    @FieldResolver((returns) => [AppointmentParticipant])
    @Authorized(Role.OWNER, Role.APPOINTMENT_PARTICIPANT)
    @LimitEstimated(30)
    async declinedBy(@Root() appointment: Appointment, @Arg('take', (type) => Int) take: number, @Arg('skip', (type) => Int) skip: number) {
        const declinedPupils = (
            await prisma.appointment_participant_pupil.findMany({
                where: {
                    appointmentId: appointment.id,
                    status: 'declined',
                },
                select: {
                    pupil: true,
                },
            })
        ).map((p) => ({ ...p.pupil, isPupil: true, userId: getUserIdTypeORM(p.pupil) }));

        const declinedStudents = (
            await prisma.appointment_participant_student.findMany({
                where: {
                    appointmentId: appointment.id,
                    status: 'declined',
                },
                select: {
                    student: true,
                },
            })
        ).map((p) => ({ ...p.student, isStudent: true, userId: getUserIdTypeORM(p.student) }));

        const declinedScreeners = (
            await prisma.appointment_participant_screener.findMany({
                where: {
                    appointmentId: appointment.id,
                    status: 'declined',
                },
                select: {
                    screener: true,
                },
            })
        ).map((p) => ({ ...p.screener, isScreener: true }));
        const participants = [...declinedPupils, ...declinedStudents, ...declinedScreeners];
        return participants;
    }
    @FieldResolver((returns) => Int)
    @Authorized(Role.OWNER, Role.APPOINTMENT_PARTICIPANT)
    async position(@Root() appointment: Appointment): Promise<number> {
        if (appointment.subcourseId) {
            return (
                (await prisma.lecture.findMany({ where: { subcourseId: appointment.subcourseId }, orderBy: { start: 'asc' } })).findIndex(
                    (currentAppointment) => currentAppointment.id === appointment.id
                ) + 1
            );
        }
        if (appointment.matchId) {
            return (
                (await prisma.lecture.findMany({ where: { matchId: appointment.matchId }, orderBy: { start: 'asc' } })).findIndex(
                    (currentAppointment) => currentAppointment.id === appointment.id
                ) + 1
            );
        }
        throw new Error('Cannot determine position of loose appointment');
    }
    @FieldResolver((returns) => Int)
    @Authorized(Role.OWNER, Role.APPOINTMENT_PARTICIPANT)
    async total(@Root() appointment: Appointment): Promise<number> {
        if (appointment.subcourseId) {
            return await prisma.lecture.count({ where: { subcourseId: appointment.subcourseId } });
        }
        if (appointment.matchId) {
            return await prisma.lecture.count({ where: { matchId: appointment.matchId } });
        }
        throw new Error('Cannot determine total of loose appointment');
    }
}
