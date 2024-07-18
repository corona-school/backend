import { Authorized, FieldResolver, Mutation, Resolver, Root } from 'type-graphql';
import { Learning_assignment as LearningAssignment, Learning_note as LearningNote, Learning_topic as LearningTopic } from '../../generated';
import { AuthorizedDeferred, Role } from '../../authorizations';
import { prisma } from '../../../common/prisma';

@Resolver((of) => LearningTopic)
export class LearningNoteMutationsResolver {
    @Mutation((returns) => LearningNote)
    @AuthorizedDeferred(Role.OWNER, Role.ADMIN)
    async learningNoteCreate() {
        // TODO:
    }

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.OWNER, Role.ADMIN)
    async learningNoteChangeStatus() {
        // TODO:
    }
}
