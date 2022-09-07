import { Secret } from '../generated';
import { Resolver, Mutation, Root, Arg, Authorized, Ctx } from 'type-graphql';
import { createPassword, createToken, requestToken, revokeToken } from '../../common/secret';
import { GraphQLContext } from '../context';
import { getSessionUser } from '../authentication';
import { Role } from '../authorizations';
import { getUserByEmail } from '../../common/user';
import { RateLimit } from '../rate-limit';

@Resolver((of) => Secret)
export class MutateSecretResolver {
    @Mutation((returns) => String)
    @Authorized(Role.USER)
    async tokenCreate(@Ctx() context: GraphQLContext) {
        return await createToken(getSessionUser(context));
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.USER)
    async passwordCreate(@Ctx() context: GraphQLContext, @Arg('password') password: string) {
        await createPassword(getSessionUser(context), password);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.USER)
    async tokenRevoke(@Ctx() context: GraphQLContext, @Arg('id') id: number) {
        await revokeToken(getSessionUser(context), id);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.UNAUTHENTICATED)
    @RateLimit('Request E-Mail Tokens', 50 /* requests per */, 5 * 60 * 60 * 1000 /* 5 hours */)
    async tokenRequest(
        @Arg('email') email: string,
        @Arg('action', { nullable: true }) action: string = 'user-authenticate',
        @Arg('redirectTo', { nullable: true }) redirectTo?: string
    ) {
        const user = await getUserByEmail(email);
        await requestToken(user, action, redirectTo);
        return true;
    }
}
