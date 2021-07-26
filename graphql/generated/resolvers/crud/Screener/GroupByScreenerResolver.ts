import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { GroupByScreenerArgs } from "./args/GroupByScreenerArgs";
import { Screener } from "../../../models/Screener";
import { ScreenerGroupBy } from "../../outputs/ScreenerGroupBy";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Screener)
export class GroupByScreenerResolver {
  @TypeGraphQL.Query(_returns => [ScreenerGroupBy], {
    nullable: false
  })
  async groupByScreener(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByScreenerArgs): Promise<ScreenerGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).screener.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
