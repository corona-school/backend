import { Arg, Authorized, Ctx, FieldResolver, Query, Resolver } from 'type-graphql';
import { getSessionUser, GraphQLUser } from '../authentication';
import { GraphQLContext } from '../context';
import { Role } from '../authorizations';
import { UserType } from '../types/user';
import { createChatSignature } from '../../common/chat/create';

@Resolver((of) => UserType)
export class FieldMeResolver {
    @Query((returns) => UserType)
    @Authorized(Role.USER)
    me(@Ctx() context: GraphQLContext): GraphQLUser {
        return getSessionUser(context);
    }

    @Query((returns) => [String])
    @Authorized(Role.USER)
    myRoles(@Ctx() context: GraphQLContext): string[] {
        return context.user?.roles ?? [];
    }

    @FieldResolver((returns) => String)
    @Authorized(Role.USER)
    async chatSignature(@Ctx() context: GraphQLContext): Promise<string> {
        const { user } = context;
        const signature = await createChatSignature(user);
        return signature;
    }

    @Query((returns) => [String])
    @Authorized(Role.USER)
    myConversations(@Ctx() context: GraphQLContext): any[] {
        return [];
    }
}
