import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { GroupByExpert_dataArgs } from "./args/GroupByExpert_dataArgs";
import { Expert_data } from "../../../models/Expert_data";
import { Expert_dataGroupBy } from "../../outputs/Expert_dataGroupBy";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Expert_data)
export class GroupByExpert_dataResolver {
  @TypeGraphQL.Query(_returns => [Expert_dataGroupBy], {
    nullable: false
  })
  async groupByExpert_data(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByExpert_dataArgs): Promise<Expert_dataGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).expert_data.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
