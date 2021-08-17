import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateCourse_instructors_studentArgs } from "./args/AggregateCourse_instructors_studentArgs";
import { Course_instructors_student } from "../../../models/Course_instructors_student";
import { AggregateCourse_instructors_student } from "../../outputs/AggregateCourse_instructors_student";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Course_instructors_student)
export class AggregateCourse_instructors_studentResolver {
  @TypeGraphQL.Query(_returns => AggregateCourse_instructors_student, {
    nullable: false
  })
  async aggregateCourse_instructors_student(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateCourse_instructors_studentArgs): Promise<AggregateCourse_instructors_student> {
    return getPrismaFromContext(ctx).course_instructors_student.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
