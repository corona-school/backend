import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateSubcourse_instructors_studentArgs } from "./args/AggregateSubcourse_instructors_studentArgs";
import { Subcourse_instructors_student } from "../../../models/Subcourse_instructors_student";
import { AggregateSubcourse_instructors_student } from "../../outputs/AggregateSubcourse_instructors_student";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Subcourse_instructors_student)
export class AggregateSubcourse_instructors_studentResolver {
  @TypeGraphQL.Query(_returns => AggregateSubcourse_instructors_student, {
    nullable: false
  })
  async aggregateSubcourse_instructors_student(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateSubcourse_instructors_studentArgs): Promise<AggregateSubcourse_instructors_student> {
    return getPrismaFromContext(ctx).subcourse_instructors_student.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
