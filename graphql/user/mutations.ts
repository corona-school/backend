import { AuthorizedDeferred, Role, hasAccess } from '../authorizations';
import { RateLimit } from '../rate-limit';
import { Mutation, Resolver, Arg, Authorized, Ctx, InputType, Field } from 'type-graphql';
import { UserType } from '../types/user';
import { isEmailAvailable } from '../../common/user/email';
import { determinePreferredLoginOption, LoginOption } from '../../common/secret';
import { getFullName, getUserByEmail } from '../../common/user';
import { GraphQLContext } from '../context';
import { toPublicToken } from '../authentication';
import { isDev } from '../../common/util/environment';
import { Length } from 'class-validator';
import { validateEmail } from '../validators';
import { getLogger } from '../../common/logger/logger';
import { DEFAULTSENDERS, sendMail } from '../../common/notification/channels/mailjet';
import { prisma } from '../../common/prisma';
import { CreatePushSubscription, addPushSubcription, removePushSubscription } from '../../common/notification/channels/push';
import { GraphQLInt } from 'graphql';
import { GraphQLJSON } from 'graphql-scalars';

@InputType()
class SupportMessage {
    @Field()
    @Length(/* min */ 1, /* max */ 10_000)
    message: string;

    @Field()
    @Length(/* min */ 1, /* max */ 200)
    subject: string;
}

@InputType()
class CreatePushSubscriptionInput implements CreatePushSubscription {
    @Field()
    @Length(/* min */ 1, /* max */ 10_000)
    endpoint: string;
    @Field({ nullable: true })
    expirationTime?: Date;
    @Field((type) => GraphQLJSON)
    keys: object;
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
            return user.active ? await determinePreferredLoginOption(user) : 'deactivated';
        } catch (error) {
            // Invalid email
            return LoginOption.none;
        }
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.USER)
    async userContactSupport(@Ctx() context: GraphQLContext, @Arg('message') message: SupportMessage) {
        const body =
            message.message +
            `\n\n\n` +
            `+------ Tech-Team Infos ------------------------+\n` +
            `SessionID: ${context.sessionToken ? toPublicToken(context.sessionToken) : '-'}\n` +
            `Roles: ${context.user.roles.join(', ')}\n`;

        await sendMail(
            `User-App - ${getFullName(context.user)} - ${message.subject}`,
            body,
            /* from */ DEFAULTSENDERS.noreply,
            /* to */ isDev ? 'backend@lern-fair.de' : 'support@lern-fair.de',
            /* from name */ 'User-App Kontaktformular',
            /* to name */ `Das beste Supportteam der Welt`,
            /* reply to */ context.user.email,
            /* reply to name */ getFullName(context.user)
        );

        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.USER)
    async userPushSubcriptionAdd(@Ctx() context: GraphQLContext, @Arg('subscription') subscription: CreatePushSubscriptionInput) {
        await addPushSubcription(context.user, subscription);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.USER)
    async userPushSubcriptionRemove(@Ctx() context: GraphQLContext, @Arg('subscriptionID', () => GraphQLInt) id: number) {
        await removePushSubscription(context.user, id);
        return true;
    }

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async markAchievementAsSeen(@Ctx() context: GraphQLContext, @Arg('achievementId') achievementId: number) {
        const achievement = await prisma.user_achievement.findFirstOrThrow({
            where: { id: achievementId },
        });
        await hasAccess(context, 'User_achievement', achievement);

        await prisma.user_achievement.update({
            where: { id: achievementId },
            data: { isSeen: true },
        });
        return true;
    }
}
