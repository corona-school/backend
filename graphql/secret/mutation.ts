import { Secret } from '../generated';
import { Resolver, Mutation, Root, Arg, Authorized, Ctx } from 'type-graphql';
import { createPassword, createToken, requestToken, revokeToken, revokeTokenByToken } from '../../common/secret';
import { GraphQLContext } from '../context';
import { getSessionUser } from '../authentication';
import { Role } from '../authorizations';
import { getUser, getUserByEmail } from '../../common/user';
import { RateLimit } from '../rate-limit';
import { getLogger } from 'log4js';
import { UserInputError } from 'apollo-server-express';
import { validateEmail } from '../validators';

const logger = getLogger('MutateSecretResolver');

@Resolver((of) => Secret)
export class MutateSecretResolver {
    @Mutation((returns) => String)
    @Authorized(Role.USER)
    async tokenCreate(@Ctx() context: GraphQLContext, @Arg('description', { nullable: true }) description: string | null) {
        return await createToken(getSessionUser(context), /* expiresAt */ null, description);
    }

    @Mutation((returns) => String)
    @Authorized(Role.ADMIN)
    async tokenCreateAdmin(@Arg('userId') userId: string) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        const user = await getUser(userId);
        const token = await createToken(user, /* expiresAt */ tomorrow, 'Support One-Day Access');
        logger.info(`Admin created a one-day login token for User(${userId})`);
        return token;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.USER)
    async passwordCreate(@Ctx() context: GraphQLContext, @Arg('password') password: string) {
        await createPassword(getSessionUser(context), password);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.USER)
    async tokenRevoke(@Ctx() context: GraphQLContext, @Arg('id', { nullable: true }) id?: number, @Arg('token', { nullable: true }) token?: string) {
        if (id) {
            await revokeToken(getSessionUser(context), id);
            return true;
        }

        if (token) {
            await revokeTokenByToken(getSessionUser(context), token);
            return true;
        }

        throw new UserInputError(`Either the id or the token must be passed`);
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.UNAUTHENTICATED)
    @RateLimit('Request E-Mail Tokens', 50 /* requests per */, 5 * 60 * 60 * 1000 /* 5 hours */)
    async tokenRequest(
        @Arg('email') email: string,
        @Arg('action', { nullable: true }) action: string = 'user-authenticate',
        @Arg('redirectTo', { nullable: true }) redirectTo?: string
    ) {
        const user = await getUserByEmail(validateEmail(email));

        if (!['user-authenticate', 'user-password-reset', 'user-verify-email'].includes(action)) {
            throw new UserInputError(`Unsupported Action for Token Request`);
        }

        await requestToken(user, action as any, redirectTo);
        return true;
    }
}
