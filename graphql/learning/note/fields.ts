import { Authorized, FieldResolver, Resolver, Root } from 'type-graphql';
import { Learning_assignment as LearningAssignment, Learning_note as LearningNote } from '../../generated';
import { Role } from '../../authorizations';
import { prisma } from '../../../common/prisma';

@Resolver((of) => LearningNote)
export class LearningNoteFieldResolver {
    @FieldResolver((returns) => [LearningNote])
    @Authorized(Role.OWNER, Role.ADMIN)
    async replies(@Root() note: LearningNote) {
        return await prisma.learning_note.findMany({
            where: {
                replyToId: note.id,
            },
        });
    }
}
