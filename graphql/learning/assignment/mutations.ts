import { Arg, Authorized, Ctx, FieldResolver, Mutation, Resolver, Root } from 'type-graphql';
import { Learning_assignment as LearningAssignment, Learning_note as LearningNote, Learning_topic as LearningTopic } from '../../generated';
import { AuthorizedDeferred, Role, hasAccess } from '../../authorizations';
import { prisma } from '../../../common/prisma';
import { GraphQLInt } from 'graphql';
import { getLogger } from '../../../common/logger/logger';
import { GraphQLContext } from '../../context';

const logger = getLogger('LearningAssignment');

@Resolver((of) => LearningAssignment)
export class LearningAssignmentMutationsResolver {
    @Mutation((returns) => LearningAssignment)
    @AuthorizedDeferred(Role.OWNER, Role.ADMIN)
    async learningAssignmentCreate(@Ctx() context: GraphQLContext, @Arg('topicId', () => GraphQLInt) topicId: number, @Arg('task') task: string) {
        const topic = await prisma.learning_topic.findUniqueOrThrow({ where: { id: topicId } });
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
}
