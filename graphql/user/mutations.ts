import { Role } from '../authorizations';
import { RateLimit } from '../rate-limit';
import { Mutation, Resolver, Arg, Authorized } from 'type-graphql';
import { UserType } from '../types/user';
import { isEmailAvailable } from '../../common/user/email';
import { determinePreferredLoginOption, LoginOption } from '../../common/secret';
import { getUserByEmail } from '../../common/user';

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
}
