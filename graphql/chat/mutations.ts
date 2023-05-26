import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import { Role } from '../../common/user/roles';
import { GraphQLContext } from '../context';
import { AuthorizedDeferred, hasAccess } from '../authorizations';
import { getLogger } from '../../common/logger/logger';
import { prisma } from '../../common/prisma';
import { ConversationInfos, getOrCreateConversation } from '../../common/chat';
import { User, getUser } from '../../common/user';
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

    @Mutation(() => String)
    @AuthorizedDeferred(Role.OWNER)
    async subcourseGroupChatCreate(@Ctx() context: GraphQLContext, @Arg('subcourseId') subcourseId: number) {
        const { user } = context;
        const subcourse = await prisma.subcourse.findUnique({
            where: { id: subcourseId },
            include: { subcourse_participants_pupil: true, lecture: true, course: true },
        });
        await hasAccess(context, 'Subcourse', subcourse);
        const subcourseParticipants = subcourse.subcourse_participants_pupil;

        const conversationInfos: ConversationInfos = {
            subject: subcourse.course.name,
            // welcomeMessages: ['Welcome!'],
            custom: {
                start: subcourse.lecture[0].start.toISOString(),
                type: 'course',
            },
        };
        const participants = await Promise.all(
            subcourseParticipants.map(async (participant) => {
                const { pupilId } = participant;
                const user = await getUser(`pupil/${pupilId}`);
                return user;
            })
        );

        participants.push(user);

        const conversation = await getOrCreateConversation(participants, conversationInfos);
        return conversation.id;
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
        throw new Error('Participant is not allowed to create conversation.');
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.USER)
    async prospectChatCreate(@Ctx() context: GraphQLContext, @Arg('subcourseId') subcourseId: number) {
        const subcourse = await prisma.subcourse.findUnique({ where: { id: subcourseId } });
        await hasAccess(context, 'Subcourse', subcourse);
        return true;
    }
}
