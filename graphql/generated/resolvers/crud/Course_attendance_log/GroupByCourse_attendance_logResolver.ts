import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { GroupByCourse_attendance_logArgs } from "./args/GroupByCourse_attendance_logArgs";
import { Course_attendance_log } from "../../../models/Course_attendance_log";
import { Course_attendance_logGroupBy } from "../../outputs/Course_attendance_logGroupBy";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Course_attendance_log)
export class GroupByCourse_attendance_logResolver {
  @TypeGraphQL.Query(_returns => [Course_attendance_logGroupBy], {
    nullable: false
  })
  async groupByCourse_attendance_log(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByCourse_attendance_logArgs): Promise<Course_attendance_logGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).course_attendance_log.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
