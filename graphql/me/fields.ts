import { Authorized, Ctx, Query, Resolver } from "type-graphql";
import { getSessionUser, GraphQLUser } from "../authentication";
import { GraphQLContext } from "../context";
import { Role } from "../authorizations";
import { UserType } from "../user/fields";

@Resolver(of => UserType)
export class FieldMeResolver {
    @Query(returns => UserType)
    @Authorized(Role.USER)
    async me(@Ctx() context: GraphQLContext): Promise<GraphQLUser> {
        return getSessionUser(context);
    }
}