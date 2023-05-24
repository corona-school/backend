import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import { Role } from '../../common/user/roles';
import * as GraphQLModel from '../generated/models';
import { GraphQLContext } from '../context';
import { AuthorizedDeferred, hasAccess } from '../authorizations';
import { getLogger } from '../../common/logger/logger';
import { prisma } from '../../common/prisma';
import { ConversationInfos, getOrCreateChatUser, getOrCreateConversation } from '../../common/chat';
import { getUser } from '../../common/user';
import { getMatchByMatchees } from '../../common/chat/helper';

const logger = getLogger('MutateChatResolver');
@Resolver()
export class MutateChatResolver {
    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    async matchChatCreate(@Ctx() context: GraphQLContext, @Arg('matcheeUserId') matcheeUserId: string) {
        const { user } = context;
        const matcheeUser = await getUser(matcheeUserId);
        const matchees = [user, matcheeUser];

        const match = await getMatchByMatchees([user.userID, matcheeUserId]);

        const conversationInfos: ConversationInfos = {
            subject: '',
            welcomeMessages: [],
            photoUrl: '',
            custom: {
                type: 'match',
            },
        };
        await hasAccess(context, 'Match', match);
        await Promise.all(
            matchees.map(async (partner) => {
                await getOrCreateChatUser(partner);
            })
        );

        await getOrCreateConversation(matchees, conversationInfos);
        return true;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    async subcourseGroupChatCreate(@Ctx() context: GraphQLContext, @Arg('subcourseId') subcourseId: number) {
        const subcourse = await prisma.subcourse.findUnique({ where: { id: subcourseId } });
        await hasAccess(context, 'Subcourse', subcourse);
        return true;
    }

    @Mutation(() => String)
    @Authorized(Role.USER)
    async participantChatCreate(@Ctx() context: GraphQLContext, @Arg('participantUserId') participantUserId: string) {
        const { user } = context;
        const participantUser = await getUser(participantUserId);
        const conversationInfos: ConversationInfos = {
            subject: '',
            welcomeMessages: [],
            photoUrl: '',
            custom: {
                type: 'participant',
            },
        };
        await getOrCreateChatUser(user);
        await getOrCreateChatUser(participantUser);
        const conversation = await getOrCreateConversation([user, participantUser], conversationInfos);
        return conversation.id;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.USER)
    async prospectChatCreate(@Ctx() context: GraphQLContext, @Arg('subcourseId') subcourseId: number) {
        const subcourse = await prisma.subcourse.findUnique({ where: { id: subcourseId } });
        await hasAccess(context, 'Subcourse', subcourse);
        return true;
    }
}
