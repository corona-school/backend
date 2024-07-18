import { Authorized, FieldResolver, Resolver, Root } from 'type-graphql';
import { Learning_assignment as LearningAssignment, Learning_note as LearningNote, Learning_topic as LearningTopic } from '../../generated';
import { ImpliesRoleOnResult, Role } from '../../authorizations';
import { prisma } from '../../../common/prisma';

@Resolver((of) => LearningTopic)
export class LearningTopicFieldResolver {
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
