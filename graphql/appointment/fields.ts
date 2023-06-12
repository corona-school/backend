import { AuthorizedDeferred, Role, hasAccess } from '../authorizations';
import { Arg, Authorized, Ctx, Field, FieldResolver, Int, ObjectType, Query, Resolver, Root } from 'type-graphql';
import { Lecture as Appointment, lecture_appointmenttype_enum } from '../generated';
import { GraphQLContext } from '../context';
import { getSessionStudent, getUserForSession, isElevated, isSessionStudent } from '../authentication';
import { Deprecated } from '../util';
import { LimitEstimated } from '../complexity';
import { prisma } from '../../common/prisma';
import { getUserIdTypeORM, getUserTypeAndIdForUserId, getUsers } from '../../common/user';

@ObjectType()
class AppointmentParticipant {
    @Field((_type) => String, { nullable: true })
    userID: string;
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
    userID: string;
    @Field((_type) => Int)
    id: number;
    @Field((_type) => String)
    firstname: string;
    @Field((_type) => String)
    lastname: string;
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
        const isOrganizer = (await prisma.lecture.count({ where: { id: appointment.id, organizerIds: { has: context.user.userID } } })) > 0;
        return isOrganizer;
    }

    @FieldResolver((returns) => Boolean)
    @Authorized(Role.USER)
    async isParticipant(@Ctx() context: GraphQLContext, @Root() appointment: Appointment) {
        const user = await getUserForSession(context.sessionToken);
        const isParticipant = (await prisma.lecture.count({ where: { id: appointment.id, participantIds: { has: user.userID } } })) > 0;
        return isParticipant;
    }
    @FieldResolver((returns) => [AppointmentParticipant], { nullable: true })
    @Authorized(Role.OWNER, Role.APPOINTMENT_PARTICIPANT)
    @LimitEstimated(30)
    async participants(@Root() appointment: Appointment, @Arg('take', (type) => Int) take: number, @Arg('skip', (type) => Int) skip: number) {
        return (await getUsers(appointment.participantIds)).map(({ email, ...rest }) => ({ ...rest }));
    }

    @FieldResolver((returns) => [Organizer])
    @Authorized(Role.USER)
    @LimitEstimated(5)
    async organizers(@Root() appointment: Appointment, @Arg('take', (type) => Int) take: number, @Arg('skip', (type) => Int) skip: number) {
        return (await getUsers(appointment.organizerIds)).map(({ email, ...rest }) => ({ ...rest }));
    }

    @FieldResolver((returns) => Int)
    @Authorized(Role.USER)
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
    @Authorized(Role.USER)
    async total(@Root() appointment: Appointment): Promise<number> {
        if (appointment.subcourseId) {
            return await prisma.lecture.count({ where: { subcourseId: appointment.subcourseId } });
        }
        if (appointment.matchId) {
            return await prisma.lecture.count({ where: { matchId: appointment.matchId } });
        }
        throw new Error('Cannot determine total of loose appointment');
    }

    @FieldResolver((returns) => String)
    @Authorized(Role.USER)
    async displayName(@Ctx() context: GraphQLContext, @Root() appointment: Appointment): Promise<string> {
        switch (appointment.appointmentType) {
            case lecture_appointmenttype_enum.match: {
                let isOrganizer;

                if (!isElevated(context) && !isSessionStudent(context)) {
                    isOrganizer = false;
                } else {
                    isOrganizer = (await prisma.lecture.count({ where: { id: appointment.id, organizerIds: { has: context.user.userID } } })) > 0;
                }

                if (isOrganizer) {
                    const [tutee] = await getUsers(appointment.participantIds);
                    return `${tutee.firstname} ${tutee.lastname}`;
                } else {
                    const [tutor] = await getUsers(appointment.organizerIds);
                    return `${tutor.firstname} ${tutor.lastname}`;
                }
            }
            case lecture_appointmenttype_enum.group: {
                const { course } = await prisma.subcourse.findUnique({ where: { id: appointment.subcourseId }, select: { course: true } });
                return course.name;
            }
            default:
                return appointment.title;
        }
    }
    @FieldResolver((returns) => String)
    @Authorized(Role.USER)
    zoomMeetingId(@Root() appointment: Appointment): string {
        if (!appointment.zoomMeetingId) {
            return null;
        }
        return appointment.zoomMeetingId;
    }
}
