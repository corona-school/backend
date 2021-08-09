import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { GroupByJufo_verification_transmissionArgs } from "./args/GroupByJufo_verification_transmissionArgs";
import { Jufo_verification_transmission } from "../../../models/Jufo_verification_transmission";
import { Jufo_verification_transmissionGroupBy } from "../../outputs/Jufo_verification_transmissionGroupBy";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Jufo_verification_transmission)
export class GroupByJufo_verification_transmissionResolver {
  @TypeGraphQL.Query(_returns => [Jufo_verification_transmissionGroupBy], {
    nullable: false
  })
  async groupByJufo_verification_transmission(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByJufo_verification_transmissionArgs): Promise<Jufo_verification_transmissionGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).jufo_verification_transmission.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
