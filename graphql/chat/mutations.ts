import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import { Role } from '../../common/user/roles';
import * as GraphQLModel from '../generated/models';
import { GraphQLContext } from '../context';
import { AuthorizedDeferred, hasAccess } from '../authorizations';
import { getLogger } from '../../common/logger/logger';
import { prisma } from '../../common/prisma';
import { getOrCreateChatUser, getOrCreateConversation } from '../../common/chat';
import { getUser, getUserTypeAndIdForUserId } from '../../common/user';
import { getMatchByMatchees, getUserIdsForChatParticipants, getUsersForChatParticipants } from '../../common/chat/helper';

const logger = getLogger('MutateChatResolver');
@Resolver((of) => GraphQLModel.Match)
export class MutateChatResolver {
    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    async matchChatCreate(@Ctx() context: GraphQLContext, @Arg('otherId') otherId: string) {
        const { user } = context;
        const otherUser = await getUser(otherId);
        const matchees = [user, otherUser];
        const matcheeIds = [user.userID, otherId];

        const match = await getMatchByMatchees(matcheeIds);

        await hasAccess(context, 'Match', match);
        matchees.forEach(async (partner) => {
            await getOrCreateChatUser(partner);
        });

        const matcheeConversation = await getOrCreateConversation(matchees);

        // TODO: add conversationId to match
        // const updatedMatch = await prisma.match.update({
        //     where: {id: match.id},
        //     data: {
        //         chatId: matcheeConversation.id
        //     }
        // })

        return match;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    async subcourseChatCreate(@Ctx() context: GraphQLContext, @Arg('subcourseId') subcourseId: number) {
        const subcourse = await prisma.subcourse.findUnique({ where: { id: subcourseId } });
        await hasAccess(context, 'Subcourse', subcourse);
        return true;
    }

    @Mutation(() => String)
    @Authorized(Role.USER)
    async participantChatCreate(@Ctx() context: GraphQLContext, @Arg('participantIds', (_type) => [String]) participantIds: string[]) {
        const [student, pupil] = await getUsersForChatParticipants(participantIds);
        console.log('STUD', student, 'PUP', pupil);
        process.exit();

        // const stud = await getOrCreateChatUser(student);
        // const pup = await getOrCreateChatUser(pupil);
        // const conversation = await getOrCreateConversation([student, pupil]);

        // console.log('STUD', stud, 'PUP', pup, conversation.id);
        // return conversation.id;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.USER)
    async prospectChatCreate(@Ctx() context: GraphQLContext, @Arg('subcourseId') subcourseId: number) {
        const subcourse = await prisma.subcourse.findUnique({ where: { id: subcourseId } });
        await hasAccess(context, 'Subcourse', subcourse);
        return true;
    }
}
