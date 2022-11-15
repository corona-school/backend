import { Role } from '../authorizations';
import { RateLimit } from '../rate-limit';
import { Mutation, Resolver, Arg, Authorized, Ctx } from 'type-graphql';
import { UserType } from '../types/user';
import { isEmailAvailable } from '../../common/user/email';
import { determinePreferredLoginOption, LoginOption } from '../../common/secret';
import { getUserByEmail } from '../../common/user';
import { GraphQLContext } from '../context';
import { toPublicToken } from '../authentication';
import mailjet from '../../common/mails/mailjet';
import { DEFAULTSENDERS } from '../../common/mails/config';
import { getLogger } from 'log4js';

const logger = getLogger('MutateUser');

@Resolver((of) => UserType)
export class MutateUserResolver {
    @Mutation((returns) => Boolean)
    @Authorized(Role.UNAUTHENTICATED)
    @RateLimit('Email Availability', 50 /* requests per */, 5 * 60 * 60 * 1000 /* 5 hours */)
    async isEmailAvailable(@Arg('email') email: string) {
        return await isEmailAvailable(email);
    }

    @Mutation((returns) => String)
    @Authorized(Role.UNAUTHENTICATED)
    @RateLimit('Determine Login Options', 50 /* requests per */, 5 * 60 * 60 * 1000 /* 5 hours */)
    async userDetermineLoginOptions(@Arg('email') email: string) {
        try {
            const user = await getUserByEmail(email);
            return await determinePreferredLoginOption(user);
        } catch (error) {
            // Invalid email
            return LoginOption.none;
        }
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.UNAUTHENTICATED)
    @RateLimit('Report Issue', 5 /* requests per */, 5 * 60 * 60 * 1000 /* 5 hours */)
    async userReportIssue(
        @Ctx() context: GraphQLContext,
        @Arg('issueTag') issueTag: string,
        @Arg('errorMessage') errorMessage: string,
        @Arg('errorStack') errorStack: string,
        @Arg('logs', (type) => [String]) logs: string[],
        @Arg('userAgent') userAgent: string
    ) {
        let result = '';
        const section = (name: string, level: number) => (result += '\n\n' + ('-'.repeat(5 - level) + ' ' + name + ' ').padEnd(30 - level * 2, '-') + '\n');
        const info = (name: string, value: string) => (result += (name + ':').padEnd(10, ' ') + value + '\n');

        section('USER', 0);
        info('IssueTag', issueTag);
        info('UserID', context.user.userID);
        info('E-Mail', context.user.email);

        section('BACKEND', 0);
        info('SessionID', context.sessionToken ? toPublicToken(context.sessionToken) : '-');
        info('Roles', context.user.roles.join(', '));
        info('Time', new Date().toISOString());

        section('FRONTEND', 0);
        info('UserAgent', userAgent);
        info('ErrorMessage', errorMessage);

        section('STACK', 1);
        result += errorStack;

        section('LOGS', 1);
        result += logs.join('\n');

        logger.info(`An issue was reported from the frontend: \n` + result);

        await mailjet.sendPure(`Frontend Issue: ${errorMessage}`, result, DEFAULTSENDERS.noreply, 'backend@lern-fair.de', 'Backend', 'Tech-Team');
        return true;
    }
}
