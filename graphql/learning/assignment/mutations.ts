import { Arg, Authorized, Ctx, FieldResolver, Mutation, Resolver, Root } from 'type-graphql';
import { Learning_assignment as LearningAssignment, Learning_note as LearningNote, Learning_topic as LearningTopic } from '../../generated';
import { AuthorizedDeferred, Role, hasAccess } from '../../authorizations';
import { prisma } from '../../../common/prisma';
import { GraphQLInt } from 'graphql';
import { getLogger } from '../../../common/logger/logger';
import { GraphQLContext } from '../../context';
import { getTopic } from '../../../common/learning/util';
import { proposeAssignment } from '../../../common/learning/assignment';

const logger = getLogger('LearningAssignment');

@Resolver((of) => LearningAssignment)
export class LearningAssignmentMutationsResolver {
    @Mutation((returns) => LearningAssignment)
    @AuthorizedDeferred(Role.OWNER, Role.ADMIN)
    async learningAssignmentCreate(@Ctx() context: GraphQLContext, @Arg('topicId', () => GraphQLInt) topicId: number, @Arg('task') task: string) {
        const topic = await getTopic(topicId);
        await hasAccess(context, 'Learning_topic', topic);

        const result = await prisma.learning_assignment.create({
            data: {
                status: 'pending',
                task,
                topicId: topicId,
            },
        });

        logger.info(`LearningAssignment(${result.id}) created by `);
        return result;
    }

    @Mutation((returns) => String)
    @AuthorizedDeferred(Role.OWNER)
    async learningAssignmentPropose(@Ctx() context: GraphQLContext, @Arg('topicId', () => GraphQLInt) topicId: number) {
        const topic = await getTopic(topicId);
        await hasAccess(context, 'Learning_topic', topic);

        const proposal = await proposeAssignment(topic);
        return proposal;
    }
}
