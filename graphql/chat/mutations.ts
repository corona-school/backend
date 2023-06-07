import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import { Role } from '../../common/user/roles';
import { GraphQLContext } from '../context';
import { AuthorizedDeferred, hasAccess } from '../authorizations';
import { getLogger } from '../../common/logger/logger';
import { prisma } from '../../common/prisma';
import { ConversationInfos, getOrCreateConversation, getOrCreateGroupConversation } from '../../common/chat';
import { User, getUser } from '../../common/user';
import { checkIfSubcourseParticipation, getMatchByMatchees, getMembersForSubcourseGroupChat } from '../../common/chat/helper';

const logger = getLogger('MutateChatResolver');
@Resolver()
export class MutateChatResolver {
    @Mutation(() => String)
    @AuthorizedDeferred(Role.OWNER)
    async matchChatCreate(@Ctx() context: GraphQLContext, @Arg('matcheeUserId') matcheeUserId: string) {
        const { user } = context;
        const matcheeUser = await getUser(matcheeUserId);
        const matchees: [User, User] = [user, matcheeUser];

        const match = await getMatchByMatchees([user.userID, matcheeUserId]);
        await hasAccess(context, 'Match', match);

        const conversationInfos: ConversationInfos = {
            custom: {
                type: 'match',
            },
        };

        const conversation = await getOrCreateConversation(matchees, conversationInfos);
        return conversation.id;
    }

    @Mutation(() => String)
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
            const conversation = await getOrCreateConversation([user, participantUser], conversationInfos);
            return conversation.id;
        }
        throw new Error('Participant is not allowed to create conversation.');
    }

    @Mutation(() => String)
    @AuthorizedDeferred(Role.OWNER)
    async subcourseGroupChatCreate(@Ctx() context: GraphQLContext, @Arg('subcourseId') subcourseId: number) {
        const subcourse = await prisma.subcourse.findUnique({
            where: { id: subcourseId },
            include: { subcourse_participants_pupil: true, subcourse_instructors_student: true, lecture: true, course: true },
        });
        await hasAccess(context, 'Subcourse', subcourse);

        const conversationInfos: ConversationInfos = {
            subject: subcourse.course.name,
            custom: {
                start: subcourse.lecture[0].start.toISOString(),
                type: 'course',
            },
        };
        const subcourseMembers = await getMembersForSubcourseGroupChat(subcourse);
        const conversation = await getOrCreateGroupConversation(subcourseMembers, subcourseId, conversationInfos);
        return conversation.id;
    }

    @Mutation(() => String)
    @Authorized(Role.PUPIL)
    async prospectChatCreate(@Ctx() context: GraphQLContext, @Arg('prospectUserId') instructorUserId: string) {
        const { user: prospectUser } = context;
        const instructorUser = await getUser(instructorUserId);

        const conversationInfos: ConversationInfos = {
            custom: {
                type: 'prospect',
            },
        };

        const conversation = await getOrCreateConversation([prospectUser, instructorUser], conversationInfos);

        return conversation.id;
    }
}
