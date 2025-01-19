import { Secret } from '../generated';
import { Resolver, Mutation, Arg, Authorized, Ctx } from 'type-graphql';
import { createPassword, createToken, getSecretByToken, requestToken, revokeSecret } from '../../common/secret';
import { GraphQLContext } from '../context';
import { getSessionUser, isAdmin } from '../authentication';
import { Role } from '../authorizations';
import { getUser, getUserByEmail, User } from '../../common/user';
import { RateLimit } from '../rate-limit';
import { getLogger } from '../../common/logger/logger';
import { UserInputError } from 'apollo-server-express';
import { validateEmail } from '../validators';
import { GraphQLString } from 'graphql';
import { deleteSessionsByDevice } from '../../common/user/session';
import { prisma } from '../../common/prisma';

const logger = getLogger('MutateSecretResolver');

@Resolver((of) => Secret)
export class MutateSecretResolver {
    @Mutation((returns) => String)
    @Authorized(Role.USER)
    async tokenCreate(
        @Ctx() context: GraphQLContext,
        @Arg('expiresAt', { nullable: true }) expiresAt: Date | null,
        @Arg('description', { nullable: true }) description: string | null,
        @Arg('deviceId', { nullable: true }) deviceId: string | null
    ) {
        return await createToken(getSessionUser(context), expiresAt, description, deviceId);
    }

    @Mutation((returns) => String)
    @Authorized(Role.ADMIN, Role.TRUSTED_SCREENER)
    async tokenCreateAdmin(@Arg('userId') userId: string, @Arg('description', { nullable: true }) description?: string) {
        const inOneWeek = new Date();
        inOneWeek.setDate(inOneWeek.getDate() + 7);

        const user = await getUser(userId);
        const token = await createToken(user, /* expiresAt */ inOneWeek, `Support ${description ?? 'Week Access'}`, null);
        logger.info(`Admin/trusted screener created a login token for User(${userId})`);
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
    async meChangeEmail(@Ctx() context: GraphQLContext, @Arg('email') email: string) {
        const user = getSessionUser(context);
        await requestToken(user, 'user-email-change', '/start', email);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.USER, Role.ADMIN)
    async tokenRevoke(
        @Ctx() context: GraphQLContext,
        @Arg('invalidateSessions') invalidateSessions: boolean,
        @Arg('id', { nullable: true }) id?: number,
        @Arg('token', { nullable: true }) token?: string
    ) {
        let user: User | undefined = undefined;
        if (!isAdmin(context)) {
            // if user is not admin, only allow to revoke own secrets
            user = getSessionUser(context);
        }
        let secret = undefined;
        if (id) {
            secret = await prisma.secret.findFirst({ where: { id, userId: user?.userID } });
        } else if (token) {
            secret = await getSecretByToken(token);
        } else {
            throw new UserInputError(`Either the id or the token must be passed`);
        }
        if (!secret) {
            throw new UserInputError(`Secret(${id ?? '<token>'}) not found/not accessible for user`);
        }
        const { id: secretId, lastUsedDeviceId: deviceId } = secret;

        await revokeSecret(user, secretId);

        if (invalidateSessions && deviceId) {
            await deleteSessionsByDevice(deviceId, user);
        }

        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.UNAUTHENTICATED)
    @RateLimit('Request E-Mail Tokens', 50 /* requests per */, 5 * 60 * 60 * 1000 /* 5 hours */)
    async tokenRequest(
        @Arg('email') email: string,
        @Arg('action', () => GraphQLString, { nullable: true }) action = 'user-authenticate',
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
