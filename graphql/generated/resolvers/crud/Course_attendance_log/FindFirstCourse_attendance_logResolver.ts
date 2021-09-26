import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { FindFirstCourse_attendance_logArgs } from "./args/FindFirstCourse_attendance_logArgs";
import { Course_attendance_log } from "../../../models/Course_attendance_log";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Course_attendance_log)
export class FindFirstCourse_attendance_logResolver {
  @TypeGraphQL.Query(_returns => Course_attendance_log, {
    nullable: true
  })
  async findFirstCourse_attendance_log(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindFirstCourse_attendance_logArgs): Promise<Course_attendance_log | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_attendance_log.findFirst({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
