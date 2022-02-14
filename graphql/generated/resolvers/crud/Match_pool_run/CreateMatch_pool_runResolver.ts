import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { CreateMatch_pool_runArgs } from "./args/CreateMatch_pool_runArgs";
import { Match_pool_run } from "../../../models/Match_pool_run";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Match_pool_run)
export class CreateMatch_pool_runResolver {
  @TypeGraphQL.Mutation(_returns => Match_pool_run, {
    nullable: false
  })
  async createMatch_pool_run(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateMatch_pool_runArgs): Promise<Match_pool_run> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).match_pool_run.create({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
