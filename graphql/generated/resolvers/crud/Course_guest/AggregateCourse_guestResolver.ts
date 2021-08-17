import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateCourse_guestArgs } from "./args/AggregateCourse_guestArgs";
import { Course_guest } from "../../../models/Course_guest";
import { AggregateCourse_guest } from "../../outputs/AggregateCourse_guest";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Course_guest)
export class AggregateCourse_guestResolver {
  @TypeGraphQL.Query(_returns => AggregateCourse_guest, {
    nullable: false
  })
  async aggregateCourse_guest(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateCourse_guestArgs): Promise<AggregateCourse_guest> {
    return getPrismaFromContext(ctx).course_guest.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
