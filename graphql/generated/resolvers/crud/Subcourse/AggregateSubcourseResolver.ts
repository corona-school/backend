import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateSubcourseArgs } from "./args/AggregateSubcourseArgs";
import { Subcourse } from "../../../models/Subcourse";
import { AggregateSubcourse } from "../../outputs/AggregateSubcourse";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Subcourse)
export class AggregateSubcourseResolver {
  @TypeGraphQL.Query(_returns => AggregateSubcourse, {
    nullable: false
  })
  async aggregateSubcourse(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateSubcourseArgs): Promise<AggregateSubcourse> {
    return getPrismaFromContext(ctx).subcourse.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
