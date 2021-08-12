import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateScreenerArgs } from "./args/AggregateScreenerArgs";
import { Screener } from "../../../models/Screener";
import { AggregateScreener } from "../../outputs/AggregateScreener";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Screener)
export class AggregateScreenerResolver {
  @TypeGraphQL.Query(_returns => AggregateScreener, {
    nullable: false
  })
  async aggregateScreener(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateScreenerArgs): Promise<AggregateScreener> {
    return getPrismaFromContext(ctx).screener.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
