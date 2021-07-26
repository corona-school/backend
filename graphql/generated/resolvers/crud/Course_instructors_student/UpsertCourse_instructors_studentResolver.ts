import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { UpsertCourse_instructors_studentArgs } from "./args/UpsertCourse_instructors_studentArgs";
import { Course_instructors_student } from "../../../models/Course_instructors_student";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Course_instructors_student)
export class UpsertCourse_instructors_studentResolver {
  @TypeGraphQL.Mutation(_returns => Course_instructors_student, {
    nullable: false
  })
  async upsertCourse_instructors_student(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpsertCourse_instructors_studentArgs): Promise<Course_instructors_student> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_instructors_student.upsert({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
