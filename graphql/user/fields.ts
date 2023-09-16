import { Student, Pupil, Screener, Secret, Concrete_notification as ConcreteNotification, Lecture, StudentWhereInput, PupilWhereInput } from '../generated';
import { Root, Authorized, FieldResolver, Query, Resolver, Arg, Ctx, ObjectType, Field, Int } from 'type-graphql';
import { UNAUTHENTICATED_USER, loginAsUser } from '../authentication';
import { GraphQLContext } from '../context';
import { Role } from '../authorizations';
import { prisma } from '../../common/prisma';
import { getSecrets } from '../../common/secret';
import { queryUser, User, userForPupil, userForStudent } from '../../common/user';
import { UserType } from '../types/user';
import { JSONResolver } from 'graphql-scalars';
import { ACCUMULATED_LIMIT, LimitedQuery, LimitEstimated } from '../complexity';
import { DEFAULT_PREFERENCES } from '../../common/notification/defaultPreferences';
import { findUsers } from '../../common/user/search';
import { getAppointmentsForUser, getLastAppointmentId, hasAppointmentsForUser } from '../../common/appointment/get';
import { getMyContacts, UserContactType } from '../../common/chat/contacts';
import { generateMeetingSDKJWT, isZoomFeatureActive } from '../../common/zoom/util';
import { getUserZAK, getZoomUsers } from '../../common/zoom/user';
import { ConcreteNotificationState } from '../../common/notification/types';

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
    @Authorized(Role.USER)
    firstname(@Root() user: User): string {
        return user.firstname;
    }

    @FieldResolver((returns) => String)
    @Authorized(Role.USER)
    lastname(@Root() user: User): string {
        return user.lastname;
    }

    @FieldResolver((returns) => String)
    @Authorized(Role.OWNER, Role.ADMIN, Role.SCREENER)
    email(@Root() user: User): string {
        return user.email;
    }

    @FieldResolver((returns) => Pupil)
    @Authorized(Role.OWNER, Role.ADMIN, Role.SCREENER)
    async pupil(@Root() user: User): Promise<Pupil> {
        if (!user.pupilId) {
            return null;
        }

        return await prisma.pupil.findUnique({ where: { id: user.pupilId } });
    }

    @FieldResolver((returns) => Student)
    @Authorized(Role.OWNER, Role.ADMIN, Role.SCREENER)
    async student(@Root() user: User): Promise<Student> {
        if (!user.studentId) {
            return null;
        }

        return await prisma.student.findUnique({ where: { id: user.studentId } });
    }

    @FieldResolver((returns) => Screener)
    @Authorized(Role.OWNER, Role.ADMIN)
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
        const fakeContext: GraphQLContext = {
            user: UNAUTHENTICATED_USER,
            ip: '?',
            prisma,
            sessionToken: 'fake',
            setCookie: () => {
                /* ignore */
            },
            sessionID: 'FAKE',
        };
        await loginAsUser(user, fakeContext);
        return fakeContext.user.roles;
    }

    @FieldResolver((returns) => [ConcreteNotification])
    @Authorized(Role.OWNER, Role.ADMIN)
    @LimitedQuery()
    async concreteNotifications(
        @Root() user: User,
        @Arg('take', { nullable: true }) take?: number,
        @Arg('skip', { nullable: true }) skip?: number
    ): Promise<ConcreteNotification[]> {
        return await prisma.concrete_notification.findMany({
            orderBy: [{ sentAt: 'desc' }],
            where: { userId: user.userID, state: ConcreteNotificationState.SENT },
            take,
            skip,
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
        return (await queryUser(user, { notificationPreferences: true })).notificationPreferences ?? DEFAULT_PREFERENCES;
    }

    @Query((returns) => [UserType])
    @Authorized(Role.ADMIN, Role.SCREENER)
    async usersSearch(
        @Ctx() context: GraphQLContext,
        @Arg('query') query: string,
        @Arg('only', { nullable: true }) only?: 'pupil' | 'student' | 'screener',
        @Arg('take', () => Int, { nullable: true }) take?: number
    ) {
        // "Needs to know" principle: Screeners should only find users they are supposed to screen
        // Admins sometimes need to investigate, and thus are allowed to fuzzy search:
        const strict = !(context.user.roles?.includes(Role.ADMIN) ?? false);
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
            const pupils = await prisma.student.findMany({
                select: { firstname: true, lastname: true, email: true, id: true },
                where: { ...pupilQuery, active: true, verification: null },
            });
            result.push(...pupils.map(userForPupil));
        }

        if (studentQuery) {
            const students = await prisma.student.findMany({
                select: { firstname: true, lastname: true, email: true, id: true },
                where: { ...studentQuery, active: true, verification: null },
            });
            result.push(...students.map(userForStudent));
        }

        return result;
    }

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
    async lastAppointmentId(@Root() user: User): Promise<number> {
        return await getLastAppointmentId(user);
    }

    @Query((returns) => [Contact])
    @Authorized(Role.USER)
    async myContactOptions(@Ctx() context: GraphQLContext): Promise<Contact[]> {
        const { user } = context;
        return await getMyContacts(user);
    }

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
}
