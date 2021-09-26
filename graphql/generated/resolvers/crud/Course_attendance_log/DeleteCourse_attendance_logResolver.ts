import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { DeleteCourse_attendance_logArgs } from "./args/DeleteCourse_attendance_logArgs";
import { Course_attendance_log } from "../../../models/Course_attendance_log";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Course_attendance_log)
export class DeleteCourse_attendance_logResolver {
  @TypeGraphQL.Mutation(_returns => Course_attendance_log, {
    nullable: true
  })
  async deleteCourse_attendance_log(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteCourse_attendance_logArgs): Promise<Course_attendance_log | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_attendance_log.delete({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
