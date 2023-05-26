import { Arg, Authorized, Ctx, FieldResolver, Query, Resolver } from 'type-graphql';
import { getSessionUser, GraphQLUser } from '../authentication';
import { GraphQLContext } from '../context';
import { Role, hasAccess } from '../authorizations';
import { UserType } from '../types/user';
import { getUserZAK } from '../../common/zoom/zoom-user';
import { generateMeetingSDKJWT } from '../../common/zoom';
import { createChatSignature } from '../../common/chat/helper';
import { Field, ObjectType } from 'type-graphql';
import { UserContactType, getMyContacts } from '../../common/chat/contacts';

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

    @Query((returns) => String)
    @Authorized(Role.USER)
    async zoomSDKJWT(@Ctx() context: GraphQLContext, @Arg('meetingId') meetingId: string, @Arg('role') role: number) {
        const meetingIdAsInt = parseInt(meetingId);
        const sdkKey = await generateMeetingSDKJWT(meetingIdAsInt, role);
        return sdkKey;
    }

    @Query((returns) => String)
    @Authorized(Role.USER)
    async zoomZAK(@Ctx() context: GraphQLContext) {
        const { user } = context;
        const userZak = await getUserZAK(user.email);
        return userZak.token || '';
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
