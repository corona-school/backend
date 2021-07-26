import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateCourse_attendance_logArgs } from "./args/AggregateCourse_attendance_logArgs";
import { Course_attendance_log } from "../../../models/Course_attendance_log";
import { AggregateCourse_attendance_log } from "../../outputs/AggregateCourse_attendance_log";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Course_attendance_log)
export class AggregateCourse_attendance_logResolver {
  @TypeGraphQL.Query(_returns => AggregateCourse_attendance_log, {
    nullable: false
  })
  async aggregateCourse_attendance_log(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateCourse_attendance_logArgs): Promise<AggregateCourse_attendance_log> {
    return getPrismaFromContext(ctx).course_attendance_log.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
