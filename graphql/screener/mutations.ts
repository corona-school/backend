import { Role } from '../authorizations';
import { Screener } from '../generated';
import { Arg, Authorized, Ctx, Field, InputType, Mutation, Resolver } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { createToken } from '../../common/secret';
import { getUser, userForScreener } from '../../common/user';
import { getLogger } from '../../common/logger/logger';
import { getScreener } from '../util';
import { ValidateEmail } from '../validators';
import { GraphQLContext } from '../context';
import { getSessionScreener } from '../authentication';
import { GraphQLInt } from 'graphql';
import * as Notification from '../../common/notification';

const log = getLogger('ScreenerMutations');

@InputType()
class ScreenerCreateInput {
    @Field()
    @ValidateEmail()
    email: string;
    @Field()
    firstname: string;
    @Field()
    lastname: string;
}

@Resolver((of) => Screener)
export class MutateScreenerResolver {
    @Mutation((returns) => String)
    @Authorized(Role.ADMIN)
    async screenerCreate(@Arg('data') data: ScreenerCreateInput) {
        const { email, firstname, lastname } = data;

        const screener = await prisma.screener.create({
            data: {
                email,
                firstname,
                lastname,
                password: 'DEPRECATED',
                active: true,
                verifiedAt: new Date(),
            },
        });

        const token = await createToken(userForScreener(screener));

        log.info(`Admin created Screener(${screener.id}) and retrieved a login token`, data);

        return token;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async screenerActivate(@Arg('screenerId') screenerId: number, @Arg('active') active: boolean) {
        const screener = await getScreener(screenerId);
        await prisma.screener.update({ data: { active }, where: { id: screener.id } });
        log.info(`Admin set Screener(${screener.id}) to ${active ? 'active' : 'inactive'}`);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.SCREENER)
    async screenerSuggest(
        @Ctx() context: GraphQLContext,
        @Arg('userID') userID: string,
        @Arg('suggestionNotificationId', () => GraphQLInt) suggestionNotificationId: number
    ) {
        const user = await getUser(userID);
        const screener = await getSessionScreener(context);

        await Notification.sendNotification(suggestionNotificationId, user, 'screening_suggestion', {});

        log.info(`Screener(${screener.id}) sent custom Notification(${suggestionNotificationId}) to User(${userID})`);

        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async screenerTrust(@Arg('screenerId') screenerId: number, @Arg('trusted') trusted: boolean) {
        const screener = await getScreener(screenerId);
        await prisma.screener.update({
            where: {
                id: screener.id,
            },
            data: {
                is_trusted: trusted,
            },
        });
        log.info(`Screener(${screener.id}) was ${trusted ? `trusted` : `untrusted`} by an admin`);

        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async screenerAllowScreening(
        @Arg('screenerId') screenerId: number,
        @Arg('pupils') pupils: boolean,
        @Arg('students') students: boolean,
        @Arg('courses') courses: boolean
    ) {
        const screener = await getScreener(screenerId);
        await prisma.screener.update({
            where: {
                id: screener.id,
            },
            data: {
                is_course_screener: courses,
                is_pupil_screener: pupils,
                is_student_screener: students,
            },
        });
        log.info(
            `Screener(${screener.id}) was allowed to screen ${pupils ? 'pupils, ' : ''} ${students ? 'students, ' : ''} ${
                courses ? 'courses, ' : ''
            } by an admin`
        );

        return true;
    }
}
