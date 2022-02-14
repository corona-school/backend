import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { DeleteMatch_pool_runArgs } from "./args/DeleteMatch_pool_runArgs";
import { Match_pool_run } from "../../../models/Match_pool_run";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Match_pool_run)
export class DeleteMatch_pool_runResolver {
  @TypeGraphQL.Mutation(_returns => Match_pool_run, {
    nullable: true
  })
  async deleteMatch_pool_run(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteMatch_pool_runArgs): Promise<Match_pool_run | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).match_pool_run.delete({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
