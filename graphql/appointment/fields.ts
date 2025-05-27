import { AuthorizedDeferred, Role, hasAccess } from '../authorizations';
import { Arg, Authorized, Ctx, Field, FieldResolver, Int, ObjectType, Query, Resolver, Root } from 'type-graphql';
import { Lecture as Appointment, Match, Subcourse } from '../generated';
import { GraphQLContext } from '../context';
import { getSessionStudent, getUserForSession, isElevated, isSessionStudent } from '../authentication';
import { Deprecated, getMatch, getSubcourse } from '../util';
import { LimitEstimated } from '../complexity';
import { prisma } from '../../common/prisma';
import { getUserTypeAndIdForUserId, getUsers, getUser } from '../../common/user';
import { GraphQLJSON } from 'graphql-scalars';
import { getZoomMeeting } from '../../common/zoom/scheduled-meeting';
import { UserType } from '../types/user';
import { getZoomUrl } from '../../common/zoom/user';
import { getLogger } from '../../common/logger/logger';
import { getDisplayName } from '../../common/appointment/util';
import { getCalendlyInviteeEvent } from '../../common/calendly';

const logger = getLogger('Appointment Fields');

@ObjectType()
class AppointmentActionsUrls {
    @Field((_type) => String, { nullable: true })
    cancelUrl: string;
    @Field((_type) => String, { nullable: true })
    rescheduleUrl: string;
}

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
    @AuthorizedDeferred(Role.OWNER, Role.APPOINTMENT_PARTICIPANT, Role.ADMIN)
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
    @Authorized(Role.OWNER, Role.APPOINTMENT_PARTICIPANT, Role.ADMIN, Role.COURSE_SCREENER)
    @LimitEstimated(30)
    async participants(
        @Ctx() context: GraphQLContext,
        @Root() appointment: Appointment,
        @Arg('take', (type) => Int) take: number,
        @Arg('skip', (type) => Int) skip: number
    ) {
        const [userType] = getUserTypeAndIdForUserId(context.user.userID);
        return (await getUsers(appointment.participantIds)).map(({ email, lastname, ...rest }) => ({
            ...rest,
            lastname: userType === 'pupil' ? undefined : lastname,
        }));
    }

    @FieldResolver((returns) => [Organizer])
    @Authorized(Role.USER, Role.ADMIN)
    @LimitEstimated(5)
    async organizers(@Root() appointment: Appointment, @Arg('take', (type) => Int) take: number, @Arg('skip', (type) => Int) skip: number) {
        return (await getUsers(appointment.organizerIds)).map(({ email, ...rest }) => ({ ...rest }));
    }

    @FieldResolver((returns) => Int)
    @Authorized(Role.USER, Role.ADMIN)
    async position(@Root() appointment: Appointment): Promise<number> {
        if (appointment.subcourseId) {
            return (
                (await prisma.lecture.findMany({ where: { subcourseId: appointment.subcourseId, isCanceled: false }, orderBy: { start: 'asc' } })).findIndex(
                    (currentAppointment) => currentAppointment.id === appointment.id
                ) + 1
            );
        }
        if (appointment.matchId) {
            return (
                (await prisma.lecture.findMany({ where: { matchId: appointment.matchId, isCanceled: false }, orderBy: { start: 'asc' } })).findIndex(
                    (currentAppointment) => currentAppointment.id === appointment.id
                ) + 1
            );
        }
        if (appointment.pupilScreeningId || appointment.instructorScreeningId || appointment.tutorScreeningId) {
            return 1;
        }
        throw new Error('Cannot determine position of loose appointment');
    }
    @FieldResolver((returns) => Int)
    @Authorized(Role.USER, Role.ADMIN)
    async total(@Root() appointment: Appointment): Promise<number> {
        if (appointment.subcourseId) {
            return await prisma.lecture.count({ where: { subcourseId: appointment.subcourseId, isCanceled: false } });
        }
        if (appointment.matchId) {
            return await prisma.lecture.count({ where: { matchId: appointment.matchId, isCanceled: false } });
        }
        if (appointment.pupilScreeningId || appointment.instructorScreeningId || appointment.tutorScreeningId) {
            1;
        }
        throw new Error('Cannot determine total of loose appointment');
    }

    @FieldResolver((returns) => String)
    @Authorized(Role.USER, Role.ADMIN)
    async displayName(@Ctx() context: GraphQLContext, @Root() appointment: Required<Appointment>): Promise<string> {
        let isOrganizer = false;
        if (isElevated(context) || isSessionStudent(context)) {
            isOrganizer =
                (await prisma.lecture.count({
                    where: {
                        id: appointment.id,
                        organizerIds: { has: context.user.userID },
                    },
                })) > 0;
        }
        return getDisplayName(appointment, isOrganizer);
    }

    @FieldResolver((returns) => GraphQLJSON, { nullable: true })
    @Authorized(Role.ADMIN)
    async zoomMeeting(@Ctx() context: GraphQLContext, @Root() appointment: Required<Appointment>) {
        if (!appointment.zoomMeetingId) {
            return null;
        }

        return await getZoomMeeting(appointment);
    }
    @FieldResolver((returns) => String, { nullable: true })
    @Authorized(Role.ADMIN, Role.APPOINTMENT_PARTICIPANT, Role.OWNER)
    async zoomMeetingUrl(@Ctx() context: GraphQLContext, @Root() appointment: Required<Appointment>) {
        const { user } = context;
        const isAdmin = user.roles.includes(Role.ADMIN);
        if (!appointment.zoomMeetingId) {
            logger.info(`No zoom meeting id exist for appointment id ${appointment.id}`);
            return null;
        }
        if (isAdmin) {
            const zoomMeeting = await getZoomMeeting(appointment);
            logger.info(`Admin requested zoom meeting url`);
            return zoomMeeting.join_url;
        }
        return await getZoomUrl(user, appointment);
    }

    // HOTFIX: During some time, many zoom meetings were created requiring a password
    // For most meetings, this should not be the case and this should return null.
    @FieldResolver((returns) => String, { nullable: true })
    @Authorized(Role.ADMIN, Role.APPOINTMENT_PARTICIPANT, Role.OWNER)
    async zoomMeetingPassword(@Ctx() context: GraphQLContext, @Root() appointment: Required<Appointment>) {
        if (!appointment.zoomMeetingId) {
            return null;
        }
        const zoomMeeting = await getZoomMeeting(appointment);
        return zoomMeeting.encrypted_password ?? null;
    }

    @FieldResolver((returns) => Match, { nullable: true })
    @Authorized(Role.OWNER, Role.APPOINTMENT_PARTICIPANT, Role.ADMIN)
    async match(@Root() appointment: Appointment) {
        if (!appointment.matchId) {
            return null;
        }

        return await getMatch(appointment.matchId);
    }

    @FieldResolver((returns) => Subcourse, { nullable: true })
    @Authorized(Role.USER, Role.ADMIN)
    async subcourse(@Root() appointment: Appointment) {
        if (!appointment.subcourseId) {
            return null;
        }

        return await getSubcourse(appointment.subcourseId);
    }

    @FieldResolver((returns) => AppointmentActionsUrls, { nullable: true })
    @Authorized(Role.APPOINTMENT_PARTICIPANT, Role.ADMIN)
    async actionUrls(@Ctx() context: GraphQLContext, @Root() appointment: Appointment) {
        const { user } = context;
        if (!appointment.eventUrl) {
            return null;
        }
        const inviteeEvent = await getCalendlyInviteeEvent(appointment.eventUrl, user.email);
        return {
            cancelUrl: inviteeEvent.cancel_url ?? null,
            rescheduleUrl: inviteeEvent.reschedule_url ?? null,
        };
    }
}

@Resolver((of) => AppointmentParticipant)
export class ExtendedFieldsParticipantResolver {
    @FieldResolver((returns) => UserType)
    @Authorized(Role.ADMIN)
    async user(@Root() participant: AppointmentParticipant) {
        return await getUser(participant.userID);
    }
}

@Resolver((of) => Organizer)
export class ExtendedFieldsOrganizerResolver {
    @FieldResolver((returns) => UserType)
    @Authorized(Role.ADMIN)
    async user(@Root() organizer: Organizer) {
        return await getUser(organizer.userID);
    }
}
