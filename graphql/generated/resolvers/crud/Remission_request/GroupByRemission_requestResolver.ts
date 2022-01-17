import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { GroupByRemission_requestArgs } from "./args/GroupByRemission_requestArgs";
import { Remission_request } from "../../../models/Remission_request";
import { Remission_requestGroupBy } from "../../outputs/Remission_requestGroupBy";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Remission_request)
export class GroupByRemission_requestResolver {
  @TypeGraphQL.Query(_returns => [Remission_requestGroupBy], {
    nullable: false
  })
  async groupByRemission_request(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByRemission_requestArgs): Promise<Remission_requestGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).remission_request.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
