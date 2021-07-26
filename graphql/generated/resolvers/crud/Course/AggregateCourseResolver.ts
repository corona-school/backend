import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateCourseArgs } from "./args/AggregateCourseArgs";
import { Course } from "../../../models/Course";
import { AggregateCourse } from "../../outputs/AggregateCourse";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Course)
export class AggregateCourseResolver {
  @TypeGraphQL.Query(_returns => AggregateCourse, {
    nullable: false
  })
  async aggregateCourse(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateCourseArgs): Promise<AggregateCourse> {
    return getPrismaFromContext(ctx).course.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
