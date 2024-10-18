import { Arg, Authorized, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { Lesson_plan as LessonPlan } from '../generated';
import { AuthorizedDeferred, ImpliesRoleOnResult, Role, hasAccess } from '../authorizations';
import { prisma } from '../../common/prisma';
import { GraphQLContext } from '../context';
import { GraphQLInt } from 'graphql';

@Resolver((of) => LessonPlan)
export class LessonPlanFieldResolver {
    @Query((returns) => [LessonPlan])
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async allLessonPlans(@Ctx() context: GraphQLContext) {
        const result = await prisma.lesson_plan.findMany();
        return result;
    }
}
