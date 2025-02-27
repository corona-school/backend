import { Arg, Authorized, Ctx, FieldResolver, Query, Resolver } from 'type-graphql';
import { getSessionUser, GraphQLUser } from '../authentication';
import { GraphQLContext } from '../context';
import { Role } from '../authorizations';
import { UserType } from '../types/user';

@Resolver((of) => UserType)
export class FieldMeResolver {
    @Query((returns) => UserType)
    @Authorized(Role.USER, Role.SSO_REGISTERING_USER)
    me(@Ctx() context: GraphQLContext): GraphQLUser {
        return getSessionUser(context);
    }

    @Query((returns) => [String])
    @Authorized(Role.USER, Role.SSO_REGISTERING_USER)
    myRoles(@Ctx() context: GraphQLContext): string[] {
        return context.user?.roles ?? [];
    }
}
