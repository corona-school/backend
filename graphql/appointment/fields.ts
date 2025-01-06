import { AuthorizedDeferred, Role, hasAccess } from '../authorizations';
import { Arg, Authorized, Ctx, Field, FieldResolver, Int, ObjectType, Query, Resolver, Root } from 'type-graphql';
import { Lecture as Appointment, lecture_appointmenttype_enum, Match, Subcourse } from '../generated';
import { GraphQLContext } from '../context';
import { getSessionStudent, getUserForSession, isElevated, isSessionStudent } from '../authentication';
import { Deprecated, getLecture, getMatch, getSubcourse } from '../util';
import { LimitEstimated } from '../complexity';
import { prisma } from '../../common/prisma';
import { getUserTypeAndIdForUserId, getUsers, getUser } from '../../common/user';
import { GraphQLJSON } from 'graphql-scalars';
import { deleteZoomMeeting, getZoomMeeting } from '../../common/zoom/scheduled-meeting';
import { UserType } from '../types/user';
import { getZoomUrl } from '../../common/zoom/user';
import { getLogger } from '../../common/logger/logger';
import moment from 'moment';
import { getAppointmentEnd } from '../../common/appointment/util';
import { ZoomError } from '../../common/util/error';
import { createZoomMeetingForAppointment } from '../../common/appointment/create';

const logger = getLogger('Appointment Fields');

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
        throw new Error('Cannot determine total of loose appointment');
    }

    @FieldResolver((returns) => String)
    @Authorized(Role.USER, Role.ADMIN)
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
                return appointment.title || 'Kein Titel';
        }
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

        const isAppointmentOrganizer = appointment.organizerIds.includes(user.userID);
        const isAppointmentCanceled = appointment.isCanceled;
        // Hasn't ended yet - This includes the duration of the meeting
        const isAppointmentInTheFuture = moment().isSameOrBefore(getAppointmentEnd(appointment));
        const isOrganizerOrAdmin = isAppointmentOrganizer || isAdmin;

        // If any of these we just use the previous logic
        if (!isOrganizerOrAdmin || !isAppointmentInTheFuture || isAppointmentCanceled) {
            return await getZoomUrl(user, appointment);
        }

        try {
            // Asking Zoom for the meeting details is the only way to verify if Zoom recognizes the meetingId we have
            await getZoomMeeting(appointment);
        } catch (error) {
            const zoomError = error as ZoomError;
            // If for some reason this meeting is now expired/deleted according to zoom (which shouldn't be the case)
            // We just try to recreate it.
            if (zoomError?.status === 404 && zoomError?.code === 3001) {
                logger.error(`Zoom Meeting Id (${appointment.zoomMeetingId}) expired or deleted`);
                await deleteZoomMeeting(appointment);
                await createZoomMeetingForAppointment(await getLecture(appointment.id));
                if (isAppointmentOrganizer) {
                    return await getZoomUrl(user, await getLecture(appointment.id));
                }
            }
        }

        if (isAdmin) {
            const zoomMeeting = await getZoomMeeting(appointment);
            logger.info(`Admin requested zoom meeting url`);
            return zoomMeeting.join_url;
        }
        return await getZoomUrl(user, appointment);
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
