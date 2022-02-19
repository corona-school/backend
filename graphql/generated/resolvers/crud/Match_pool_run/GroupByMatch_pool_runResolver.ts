import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { GroupByMatch_pool_runArgs } from "./args/GroupByMatch_pool_runArgs";
import { Match_pool_run } from "../../../models/Match_pool_run";
import { Match_pool_runGroupBy } from "../../outputs/Match_pool_runGroupBy";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Match_pool_run)
export class GroupByMatch_pool_runResolver {
  @TypeGraphQL.Query(_returns => [Match_pool_runGroupBy], {
    nullable: false
  })
  async groupByMatch_pool_run(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByMatch_pool_runArgs): Promise<Match_pool_runGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).match_pool_run.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
