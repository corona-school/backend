import { Role } from "../authorizations";
import { RateLimit } from "../rate-limit";
import { Mutation, Resolver, Arg, Authorized } from "type-graphql";
import { UserType } from "./fields";
import { isEmailAvailable } from "../../common/user/email";

@Resolver(of => UserType)
export class MutateUserResolver {
    @Mutation(returns => Boolean)
    @Authorized(Role.UNAUTHENTICATED)
    @RateLimit("Email Availability", 50 /* requests per */, 5 * 60 * 60 * 1000 /* 5 hours */)
    async isEmailAvailable(@Arg("email") email: string) {
        return await isEmailAvailable(email);
    }
}