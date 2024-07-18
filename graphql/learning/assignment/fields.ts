import { Authorized, FieldResolver, Resolver, Root } from 'type-graphql';
import { Learning_assignment as LearningAssignment, Learning_note as LearningNote } from '../../generated';
import { Role } from '../../authorizations';
import { prisma } from '../../../common/prisma';

@Resolver((of) => LearningAssignment)
export class LearningAssignmentFieldResolver {
    @FieldResolver((returns) => [LearningNote])
    @Authorized(Role.OWNER, Role.ADMIN)
    async notes(@Root() assignment: LearningAssignment) {
        return await prisma.learning_note.findMany({
            where: {
                assignmentId: assignment.id,
            },
        });
    }
}
