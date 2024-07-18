import { Authorized, FieldResolver, Mutation, Resolver, Root } from 'type-graphql';
import { Learning_assignment as LearningAssignment, Learning_note as LearningNote, Learning_topic as LearningTopic } from '../../generated';
import { Role } from '../../authorizations';
import { prisma } from '../../../common/prisma';

@Resolver((of) => LearningTopic)
export class LearningTopicMutationsResolver {
    @Mutation((returns) => LearningTopic)
    @Authorized(Role.OWNER, Role.ADMIN)
    async learningTopicCreate() {
        // TODO:
    }
}
