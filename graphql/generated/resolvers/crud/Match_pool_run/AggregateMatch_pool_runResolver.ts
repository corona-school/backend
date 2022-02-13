import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateMatch_pool_runArgs } from "./args/AggregateMatch_pool_runArgs";
import { Match_pool_run } from "../../../models/Match_pool_run";
import { AggregateMatch_pool_run } from "../../outputs/AggregateMatch_pool_run";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Match_pool_run)
export class AggregateMatch_pool_runResolver {
  @TypeGraphQL.Query(_returns => AggregateMatch_pool_run, {
    nullable: false
  })
  async aggregateMatch_pool_run(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateMatch_pool_runArgs): Promise<AggregateMatch_pool_run> {
    return getPrismaFromContext(ctx).match_pool_run.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
