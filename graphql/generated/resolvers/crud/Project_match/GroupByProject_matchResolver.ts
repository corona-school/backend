import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { GroupByProject_matchArgs } from "./args/GroupByProject_matchArgs";
import { Project_match } from "../../../models/Project_match";
import { Project_matchGroupBy } from "../../outputs/Project_matchGroupBy";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Project_match)
export class GroupByProject_matchResolver {
  @TypeGraphQL.Query(_returns => [Project_matchGroupBy], {
    nullable: false
  })
  async groupByProject_match(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByProject_matchArgs): Promise<Project_matchGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).project_match.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
