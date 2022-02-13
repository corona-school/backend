import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { FindFirstMatch_pool_runArgs } from "./args/FindFirstMatch_pool_runArgs";
import { Match_pool_run } from "../../../models/Match_pool_run";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Match_pool_run)
export class FindFirstMatch_pool_runResolver {
  @TypeGraphQL.Query(_returns => Match_pool_run, {
    nullable: true
  })
  async findFirstMatch_pool_run(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindFirstMatch_pool_runArgs): Promise<Match_pool_run | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).match_pool_run.findFirst({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
