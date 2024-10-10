import { Arg, Authorized, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { Learning_assignment as LearningAssignment, Learning_note as LearningNote } from '../../generated';
import { AuthorizedDeferred, ImpliesRoleOnResult, Role, hasAccess } from '../../authorizations';
import { prisma } from '../../../common/prisma';
import { GraphQLContext } from '../../context';
import { GraphQLInt } from 'graphql';

@Resolver((of) => LearningAssignment)
export class LearningAssignmentFieldResolver {
    @Query((returns) => LearningAssignment)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    @ImpliesRoleOnResult(Role.OWNER, Role.OWNER)
    async learningAssignment(@Ctx() context: GraphQLContext, @Arg('id', () => GraphQLInt) id: number) {
        const result = await prisma.learning_assignment.findUniqueOrThrow({ where: { id } });
        await hasAccess(context, 'Learning_assignment', result);
        return result;
    }

    @FieldResolver((returns) => [LearningNote])
    @Authorized(Role.OWNER, Role.ADMIN)
    @ImpliesRoleOnResult(Role.OWNER, Role.OWNER)
    async notes(@Root() assignment: LearningAssignment) {
        return await prisma.learning_note.findMany({
            where: {
                assignmentId: assignment.id,
            },
        });
    }
}
