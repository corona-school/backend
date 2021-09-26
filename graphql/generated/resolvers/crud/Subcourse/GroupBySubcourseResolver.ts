import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { GroupBySubcourseArgs } from "./args/GroupBySubcourseArgs";
import { Subcourse } from "../../../models/Subcourse";
import { SubcourseGroupBy } from "../../outputs/SubcourseGroupBy";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Subcourse)
export class GroupBySubcourseResolver {
  @TypeGraphQL.Query(_returns => [SubcourseGroupBy], {
    nullable: false
  })
  async groupBySubcourse(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupBySubcourseArgs): Promise<SubcourseGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).subcourse.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
