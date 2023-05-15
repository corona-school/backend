import { Role } from '../authorizations';
import { RateLimit } from '../rate-limit';
import { Mutation, Resolver, Arg, Authorized, Ctx, InputType, Field } from 'type-graphql';
import { UserType } from '../types/user';
import { isEmailAvailable } from '../../common/user/email';
import { determinePreferredLoginOption, LoginOption } from '../../common/secret';
import { getFullName, getUserByEmail } from '../../common/user';
import { GraphQLContext } from '../context';
import { toPublicToken } from '../authentication';
import mailjet from '../../common/mails/mailjet';
import { DEFAULTSENDERS } from '../../common/mails/config';
import { isDev } from '../../common/util/environment';
import { Length } from 'class-validator';
import { validateEmail } from '../validators';
import { getLogger } from '../../common/logger/logger';

@InputType()
class SupportMessage {
    @Field()
    @Length(/* min */ 1, /* max */ 10_000)
    message: string;

    @Field()
    @Length(/* min */ 1, /* max */ 200)
    subject: string;
}

const logger = getLogger('User Mutations');
const issueReporterLogger = getLogger('IssueReporter');

@Resolver((of) => UserType)
export class MutateUserResolver {
    @Mutation((returns) => Boolean)
    @Authorized(Role.UNAUTHENTICATED)
    @RateLimit('Email Availability', 50 /* requests per */, 5 * 60 * 60 * 1000 /* 5 hours */)
    async isEmailAvailable(@Arg('email') email: string) {
        return await isEmailAvailable(validateEmail(email));
    }

    @Mutation((returns) => String)
    @Authorized(Role.UNAUTHENTICATED)
    @RateLimit('Determine Login Options', 50 /* requests per */, 5 * 60 * 60 * 1000 /* 5 hours */)
    async userDetermineLoginOptions(@Arg('email') email: string) {
        try {
            const user = await getUserByEmail(validateEmail(email));
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

        issueReporterLogger.addContext('issureTag', issueTag);
        issueReporterLogger.addContext('userAgent', userAgent);
        issueReporterLogger.addContext('userID', context.user.userID);

        logs.map((log) => issueReporterLogger.info(log));
        const err: Error = {
            name: 'IssueReporter',
            stack: errorStack,
            message: errorMessage,
        };
        issueReporterLogger.error(errorMessage, err);

        if (!isDev) {
            await mailjet.sendPure(`Frontend Issue: ${errorMessage}`, result, DEFAULTSENDERS.noreply, 'backend@lern-fair.de', 'Backend', 'Tech-Team');
        }

        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.USER)
    async userContactSupport(@Ctx() context: GraphQLContext, @Arg('message') message: SupportMessage) {
        let body =
            message.message +
            `\n\n\n` +
            `+------ Tech-Team Infos ------------------------+\n` +
            `SessionID: ${context.sessionToken ? toPublicToken(context.sessionToken) : '-'}\n` +
            `Roles: ${context.user.roles.join(', ')}\n`;

        await mailjet.sendPure(
            `User-App - ${getFullName(context.user!)} - ${message.subject}`,
            body,
            /* from */ DEFAULTSENDERS.noreply,
            /* to */ isDev ? 'backend@lern-fair.de' : 'support@lern-fair.de',
            /* from name */ 'User-App Kontaktformular',
            /* to name */ `Das beste Supportteam der Welt`,
            /* reply to */ context.user!.email,
            /* reply to name */ getFullName(context.user!)
        );

        return true;
    }
}
