import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import { Role } from '../../common/user/roles';
import * as GraphQLModel from '../generated/models';
import { GraphQLContext } from '../context';
import { AuthorizedDeferred, hasAccess } from '../authorizations';
import { getLogger } from '../../common/logger/logger';
import { prisma } from '../../common/prisma';
import { ConversationInfos, getOrCreateChatUser, getOrCreateConversation } from '../../common/chat';
import { User, getUser, isStudent } from '../../common/user';
import { checkIfSubcourseParticipation, getMatchByMatchees } from '../../common/chat/helper';

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
        await hasAccess(context, 'Match', match);

        const conversationInfos: ConversationInfos = {
            custom: {
                type: 'match',
            },
        };

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

    @Mutation(() => Boolean)
    @Authorized(Role.USER)
    async participantChatCreate(@Ctx() context: GraphQLContext, @Arg('participantUserId') participantUserId: string) {
        const { user } = context;
        const participantUser = await getUser(participantUserId);

        const allowed = await checkIfSubcourseParticipation([user.userID, participantUserId]);
        const conversationInfos: ConversationInfos = {
            custom: {
                type: 'participant',
            },
        };

        if (allowed) {
            await getOrCreateConversation([user, participantUser], conversationInfos);
            return true;
        }
        return false;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.USER)
    async prospectChatCreate(@Ctx() context: GraphQLContext, @Arg('subcourseId') subcourseId: number) {
        const subcourse = await prisma.subcourse.findUnique({ where: { id: subcourseId } });
        await hasAccess(context, 'Subcourse', subcourse);
        return true;
    }
}
