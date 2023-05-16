import { Authorized, Ctx, FieldResolver, Query, Resolver } from 'type-graphql';
import { getSessionUser, GraphQLUser } from '../authentication';
import { GraphQLContext } from '../context';
import { Role } from '../authorizations';
import { UserType } from '../types/user';
import { createChatSignature } from '../../common/chat/helper';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
class Contact {
    @Field((_type) => UserType)
    user: UserType;
    @Field((_type) => String)
    contactReason: string;
    @Field((_type) => String)
    chatId: string;
}
@Resolver((of) => UserType)
export class FieldMeResolver {
    @Query((returns) => UserType)
    @Authorized(Role.USER)
    async me(@Ctx() context: GraphQLContext): Promise<GraphQLUser> {
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

    @Query((returns) => [Contact])
    @Authorized(Role.USER)
    myContactOptions(@Ctx() context: GraphQLContext): Contact[] {
        return [];
    }

    @Query((returns) => [String])
    @Authorized(Role.USER)
    myConversations(@Ctx() context: GraphQLContext): any[] {
        return [];
    }
}
