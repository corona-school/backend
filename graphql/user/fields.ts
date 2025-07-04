import {
    Student,
    Pupil,
    Screener,
    Secret,
    Concrete_notification as ConcreteNotification,
    Lecture,
    StudentWhereInput,
    PupilWhereInput,
    Log,
    Push_subscription as PushSubscription,
    notification_channel_enum as NotificationChannelEnum,
} from '../generated';
import { Root, Authorized, FieldResolver, Query, Resolver, Arg, Ctx, ObjectType, Field, Int } from 'type-graphql';
import { GraphQLContext } from '../context';
import { Role } from '../authorizations';
import { prisma } from '../../common/prisma';
import { getSecrets } from '../../common/secret';
import { getReferredByIDCount, getTotalSupportedHours, queryUser, User, userForPupil, userForStudent } from '../../common/user';
import { UserType } from '../types/user';
import { JSONResolver } from 'graphql-scalars';
import { ACCUMULATED_LIMIT, LimitedQuery, LimitEstimated } from '../complexity';
import { findUsers } from '../../common/user/search';
import { getAppointmentsForUser, getEdgeAppointmentId, hasAppointmentsForUser } from '../../common/appointment/get';
import { getMyContacts, UserContactType } from '../../common/chat/contacts';
import { generateMeetingSDKJWT, isZoomFeatureActive } from '../../common/zoom/util';
import { getUserZAK, getZoomUsers } from '../../common/zoom/user';
import { ConcreteNotificationState } from '../../common/notification/types';
import { getAchievementById, getFurtherAchievements, getNextStepAchievements, getUserAchievements } from '../../common/achievement/get';
import { Achievement } from '../types/achievement';
import { Deprecated, Doc } from '../util';
import { createChatSignature } from '../../common/chat/create';
import assert from 'assert';
import { getPushSubscriptions, publicKey } from '../../common/notification/channels/push';
import { getUserNotificationPreferences } from '../../common/notification';
import { evaluateUserRoles } from '../../common/user/evaluate_roles';

@ObjectType()
export class UserContact implements UserContactType {
    @Field()
    userID: string;
    @Field()
    firstname: string;
    @Field()
    lastname: string;
    @Field()
    email: string;
}

@ObjectType()
export class Contact {
    @Field((_type) => UserType)
    user: UserContact;
    @Field((_type) => [String])
    contactReasons: string[];
    @Field((_type) => String, { nullable: true })
    chatId?: string;
}
@Resolver((of) => UserType)
export class UserFieldsResolver {
    @FieldResolver((returns) => String)
    @Authorized(Role.USER, Role.ADMIN, Role.TEMPORARY_OWNER)
    firstname(@Root() user: User): string {
        return user.firstname;
    }

    @FieldResolver((returns) => String)
    @Authorized(Role.USER, Role.ADMIN, Role.TEMPORARY_OWNER)
    lastname(@Root() user: User): string {
        return user.lastname;
    }

    // NOTE: In the following we use TEMPORARY_OWNER instead of OWNER,
    // as the frontend uses a global "GetUser" query for all users, regardless whether it is just a temporary user
    // such as SSO_REGISTERING_USER or a real user, thus we allow this query, although it returns mostly nulls

    @FieldResolver((returns) => String)
    @Authorized(Role.TEMPORARY_OWNER, Role.ADMIN, Role.SCREENER)
    email(@Root() user: User): string {
        return user.email;
    }

    @FieldResolver((returns) => Pupil)
    @Authorized(Role.TEMPORARY_OWNER, Role.ADMIN, Role.SCREENER)
    async pupil(@Root() user: User): Promise<Pupil> {
        if (!user.pupilId) {
            return null;
        }

        return await prisma.pupil.findUnique({ where: { id: user.pupilId } });
    }

    @FieldResolver((returns) => Student)
    @Authorized(Role.TEMPORARY_OWNER, Role.ADMIN, Role.SCREENER)
    async student(@Root() user: User): Promise<Student> {
        if (!user.studentId) {
            return null;
        }

        return await prisma.student.findUnique({ where: { id: user.studentId } });
    }

    @FieldResolver((returns) => Screener)
    @Authorized(Role.TEMPORARY_OWNER, Role.ADMIN)
    async screener(@Root() user: User): Promise<Screener> {
        if (!user.screenerId) {
            return null;
        }

        return await prisma.screener.findUnique({ where: { id: user.screenerId } });
    }

    @FieldResolver((returns) => [Secret])
    @Authorized(Role.OWNER, Role.ADMIN)
    async secrets(@Root() user: User) {
        return await getSecrets(user);
    }

    @FieldResolver((returns) => [String])
    @Authorized(Role.ADMIN)
    async roles(@Root() user: User) {
        return await evaluateUserRoles(user);
    }

    @FieldResolver((returns) => Int, { description: 'Number of referrals made by the user' })
    @Authorized(Role.OWNER, Role.ADMIN)
    async referralCount(@Root() user: User): Promise<number> {
        const count = await getReferredByIDCount(user.userID);
        return count;
    }

    @FieldResolver((returns) => Int, { description: 'Total hours supported by referred students/pupils - 0 if less than 3 users were referred for privacy' })
    @Authorized(Role.OWNER, Role.ADMIN)
    async supportedHours(@Root() user: User): Promise<number> {
        const totalHours = await getTotalSupportedHours(user.userID);
        return totalHours;
    }

    // -------- Notifications ---------------------

    @FieldResolver((returns) => [ConcreteNotification])
    @Authorized(Role.OWNER, Role.ADMIN)
    @LimitedQuery()
    async concreteNotifications(
        @Ctx() context: GraphQLContext,
        @Root() user: User,
        @Arg('take', { nullable: true }) take?: number,
        @Arg('skip', { nullable: true }) skip?: number
    ): Promise<ConcreteNotification[]> {
        const isAdmin = context.user.roles.includes(Role.ADMIN);
        const userQuery = {
            notification: {
                message_translation: {
                    some: {},
                },
            },
            NOT: { notification: { disabledChannels: { has: NotificationChannelEnum.inapp } } },
        };
        return await prisma.concrete_notification.findMany({
            orderBy: [{ sentAt: 'desc' }],
            where: {
                userId: user.userID,
                state: ConcreteNotificationState.SENT,
                AND: [isAdmin ? null : userQuery],
            },
            take,
            skip,
        });
    }

    @FieldResolver((returns) => [ConcreteNotification])
    @Authorized(Role.SCREENER, Role.ADMIN)
    async receivedScreeningSuggestions(@Root() user: User): Promise<ConcreteNotification[]> {
        return await prisma.concrete_notification.findMany({
            orderBy: [{ sentAt: 'desc' }],
            where: {
                userId: user.userID,
                state: ConcreteNotificationState.SENT,
                notification: {
                    onActions: { has: 'screening_suggestion' },
                },
            },
            include: { notification: true },
        });
    }

    @FieldResolver((returns) => Date, { nullable: true })
    @Authorized(Role.OWNER, Role.ADMIN)
    async lastTimeCheckedNotifications(@Root() user: User): Promise<Date | null> {
        return (await queryUser(user, { lastTimeCheckedNotifications: true })).lastTimeCheckedNotifications;
    }

    @FieldResolver((returns) => JSONResolver, { nullable: true })
    @Authorized(Role.OWNER, Role.ADMIN)
    async notificationPreferences(@Root() user: User) {
        return await getUserNotificationPreferences(user, false);
    }

    @FieldResolver((returns) => JSONResolver, { nullable: true })
    @Authorized(Role.OWNER, Role.ADMIN)
    async calendarPreferences(@Root() user: User) {
        return (await queryUser(user, { calendarPreferences: true })).calendarPreferences;
    }

    // ------------- Web Push ----------------

    @FieldResolver((returns) => [PushSubscription])
    @Authorized(Role.OWNER, Role.ADMIN)
    async pushSubscriptions(@Root() user: User) {
        return await getPushSubscriptions(user);
    }

    // Query doesn't really belong to the User entity, but there isn't a better place
    // for such global config
    @Query((returns) => String, { nullable: true })
    @Authorized(Role.UNAUTHENTICATED)
    @Doc("Returns the 'applicationServerKey' as described by the WebPush Spec")
    pushPublicKey() {
        return publicKey;
    }

    // ------------- User Queries ----------------

    @Query((returns) => [UserType])
    @Authorized(Role.ADMIN, Role.PUPIL_SCREENER, Role.STUDENT_SCREENER)
    async usersSearch(
        @Ctx() context: GraphQLContext,
        @Arg('query') query: string,
        @Arg('only', { nullable: true }) only?: 'pupil' | 'student' | 'screener',
        @Arg('take', () => Int, { nullable: true }) take?: number
    ) {
        const strict = false; // !(context.user.roles?.includes(Role.ADMIN) ?? false);

        const isAdmin = context.user.roles.includes(Role.ADMIN);
        if (!isAdmin) {
            const isPupilScreener = context.user.roles.includes(Role.PUPIL_SCREENER);
            const isStudentScreener = context.user.roles.includes(Role.STUDENT_SCREENER);
            if (!isPupilScreener) {
                assert(isStudentScreener);
                only = 'student';
            }

            if (!isStudentScreener) {
                assert(isPupilScreener);
                only = 'pupil';
            }
        }

        return await findUsers(query, only, take, strict);
    }

    // During mail campaigns we need to retrieve a potentially large amount of users
    // This endpoint has no restriction in the number of users returned,
    //  and should thus be used with care
    @Query((returns) => [UserType])
    @Authorized(Role.ADMIN)
    @LimitEstimated(ACCUMULATED_LIMIT) // no subqueries allowed
    async usersForCampaign(
        @Arg('pupilQuery', { nullable: true }) pupilQuery?: PupilWhereInput,
        @Arg('studentQuery', { nullable: true }) studentQuery?: StudentWhereInput
    ) {
        const result: User[] = [];

        if (pupilQuery) {
            // Make sure only active users with verified email are returned
            const pupils = await prisma.pupil.findMany({
                select: { firstname: true, lastname: true, email: true, id: true },
                where: {
                    ...pupilQuery,
                    active: true,
                    verifiedAt: { not: null },
                    OR: [
                        {
                            subcourse_participants_pupil: {
                                some: {},
                            },
                        },
                        {
                            match: {
                                some: {},
                            },
                        },
                        {
                            pupil_screening: {
                                some: {
                                    status: 'success',
                                },
                            },
                        },
                    ],
                },
            });
            result.push(...pupils.map(userForPupil));
        }

        if (studentQuery) {
            const students = await prisma.student.findMany({
                select: { firstname: true, lastname: true, email: true, id: true },
                where: {
                    AND: [
                        studentQuery,
                        {
                            active: true,
                            verifiedAt: { not: null },
                        },
                        // For now we exclude unscreened helpers, as they wont be interested
                        // in most of our marketing campaigns anyways
                        {
                            OR: [{ screening: { status: 'success' } }, { instructor_screening: { status: 'success' } }],
                        },
                    ],
                },
            });
            result.push(...students.map(userForStudent));
        }

        return result;
    }

    // ------------ Appointments --------------

    @FieldResolver((returns) => [Lecture], { nullable: true })
    @Authorized(Role.ADMIN, Role.OWNER)
    @LimitedQuery()
    async appointments(
        @Root() user: User,
        @Arg('take') take: number,
        @Arg('skip') skip: number,
        @Arg('cursor', { nullable: true }) cursor?: number,
        @Arg('direction', { nullable: true }) direction?: 'next' | 'last'
    ): Promise<Lecture[]> {
        return await getAppointmentsForUser(user, take, skip, cursor, direction);
    }

    @FieldResolver((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.OWNER)
    async hasAppointments(@Root() user: User): Promise<boolean> {
        return await hasAppointmentsForUser(user);
    }

    @FieldResolver((returns) => Int, { nullable: true })
    @Authorized(Role.ADMIN, Role.OWNER)
    async firstAppointmentId(@Root() user: User): Promise<number> {
        return await getEdgeAppointmentId(user, 'first');
    }

    @FieldResolver((returns) => Int, { nullable: true })
    @Authorized(Role.ADMIN, Role.OWNER)
    async lastAppointmentId(@Root() user: User): Promise<number> {
        return await getEdgeAppointmentId(user, 'last');
    }

    // ------------- Achievements ------------

    @FieldResolver((returns) => Achievement)
    @Authorized(Role.ADMIN, Role.OWNER)
    async achievement(@Root() user: User, @Arg('id') id: number): Promise<Achievement> {
        const achievement = await getAchievementById(user, id);
        return achievement;
    }
    @FieldResolver((returns) => [Achievement])
    @Authorized(Role.ADMIN, Role.OWNER)
    async nextStepAchievements(@Root() user: User): Promise<Achievement[]> {
        const achievements = await getNextStepAchievements(user);
        return achievements;
    }
    @FieldResolver((returns) => [Achievement])
    @Authorized(Role.ADMIN, Role.OWNER)
    async furtherAchievements(@Root() user: User): Promise<Achievement[]> {
        const achievements = await getFurtherAchievements(user);
        return achievements;
    }
    @FieldResolver((returns) => [Achievement])
    @Authorized(Role.ADMIN, Role.OWNER)
    async achievements(@Root() user: User): Promise<Achievement[]> {
        const achievements = await getUserAchievements(user);
        return achievements;
    }

    // Also expose the underlying data to simplify debugging
    @FieldResolver((returns) => [JSONResolver])
    @Authorized(Role.ADMIN)
    @Doc(`Internal - Do not use!`)
    async _achievementEvents(@Root() user: User) {
        return await prisma.achievement_event.findMany({
            where: { userId: user.userID },
        });
    }

    @FieldResolver((returns) => [JSONResolver])
    @Authorized(Role.ADMIN)
    @Doc(`Internal - Do not use!`)
    async _achievementData(@Root() user: User) {
        return await prisma.user_achievement.findMany({
            where: { userId: user.userID },
        });
    }

    // ----------- Chat ----------------

    @FieldResolver((returns) => [Contact])
    @Authorized(Role.ADMIN, Role.OWNER)
    async contactOptions(@Root() user: User) {
        return await getMyContacts(user);
    }

    @Query((returns) => [Contact])
    @Authorized(Role.USER)
    @Deprecated(`Use me { contactOptions } !`)
    async myContactOptions(@Ctx() context: GraphQLContext): Promise<Contact[]> {
        const { user } = context;
        return await getMyContacts(user);
    }

    @FieldResolver((returns) => String)
    @Authorized(Role.USER, Role.ADMIN)
    async chatSignature(@Root() user: User): Promise<string> {
        const signature = await createChatSignature(user);
        return signature;
    }

    // ------------ Zoom ---------------

    @FieldResolver((returns) => String)
    @Authorized(Role.ADMIN, Role.OWNER)
    zoomSDKJWT(@Ctx() context: GraphQLContext, @Arg('meetingId') meetingId: string, @Arg('role') role: number) {
        const meetingIdAsInt = parseInt(meetingId);
        const sdkKey = generateMeetingSDKJWT(meetingIdAsInt, role);
        return sdkKey;
    }

    @FieldResolver((returns) => String)
    @Authorized(Role.ADMIN, Role.OWNER)
    async zoomZAK(@Ctx() context: GraphQLContext) {
        const { user } = context;

        if (!isZoomFeatureActive()) {
            return '';
        }

        const userZak = await getUserZAK(user.email);
        if (!userZak || !userZak.token) {
            throw new Error('Could not retrieve Zoom ZAK');
        }
        return userZak.token;
    }

    @Query((returns) => JSONResolver, { nullable: true })
    @Authorized(Role.ADMIN)
    async zoomUserLicenses() {
        const zoomUsers = await getZoomUsers();
        return zoomUsers;
    }

    @FieldResolver((type) => [Log])
    @Authorized(Role.ADMIN)
    @LimitEstimated(100)
    async logs(@Root() user: Required<User>) {
        return await prisma.log.findMany({
            where: { userID: user.userID },
            orderBy: { createdAt: 'asc' },
        });
    }
}
