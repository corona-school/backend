import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { UpdateRemission_requestArgs } from "./args/UpdateRemission_requestArgs";
import { Remission_request } from "../../../models/Remission_request";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Remission_request)
export class UpdateRemission_requestResolver {
  @TypeGraphQL.Mutation(_returns => Remission_request, {
    nullable: true
  })
  async updateRemission_request(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpdateRemission_requestArgs): Promise<Remission_request | null> {
    return getPrismaFromContext(ctx).remission_request.update(args);
  }
}
