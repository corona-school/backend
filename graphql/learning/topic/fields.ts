import { Arg, Authorized, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { Learning_assignment as LearningAssignment, Learning_note as LearningNote, Learning_topic as LearningTopic } from '../../generated';
import { AuthorizedDeferred, ImpliesRoleOnResult, Role, hasAccess } from '../../authorizations';
import { prisma } from '../../../common/prisma';
import { GraphQLContext } from '../../context';
import { GraphQLInt } from 'graphql';

@Resolver((of) => LearningTopic)
export class LearningTopicFieldResolver {
    @Query((returns) => LearningTopic)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    @ImpliesRoleOnResult(Role.OWNER, Role.OWNER)
    async learningTopic(@Ctx() context: GraphQLContext, @Arg('id', () => GraphQLInt) id: number) {
        const result = await prisma.learning_topic.findUniqueOrThrow({ where: { id } });
        await hasAccess(context, 'Learning_topic', result);
        return result;
    }

    @FieldResolver((returns) => [LearningNote])
    @Authorized(Role.OWNER, Role.ADMIN)
    @ImpliesRoleOnResult(Role.OWNER, Role.OWNER)
    async notes(@Root() topic: LearningTopic) {
        return await prisma.learning_note.findMany({
            where: {
                topicId: topic.id,
            },
        });
    }

    @FieldResolver((returns) => [LearningAssignment])
    @Authorized(Role.OWNER, Role.ADMIN)
    @ImpliesRoleOnResult(Role.OWNER, Role.OWNER)
    async assignments(@Root() topic: LearningTopic) {
        return await prisma.learning_assignment.findMany({
            where: {
                topicId: topic.id,
            },
        });
    }
}
