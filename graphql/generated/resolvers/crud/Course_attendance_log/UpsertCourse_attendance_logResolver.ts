import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { UpsertCourse_attendance_logArgs } from "./args/UpsertCourse_attendance_logArgs";
import { Course_attendance_log } from "../../../models/Course_attendance_log";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Course_attendance_log)
export class UpsertCourse_attendance_logResolver {
  @TypeGraphQL.Mutation(_returns => Course_attendance_log, {
    nullable: false
  })
  async upsertCourse_attendance_log(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpsertCourse_attendance_logArgs): Promise<Course_attendance_log> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_attendance_log.upsert({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
