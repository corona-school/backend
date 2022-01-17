import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { FindUniqueRemission_requestArgs } from "./args/FindUniqueRemission_requestArgs";
import { Remission_request } from "../../../models/Remission_request";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Remission_request)
export class FindUniqueRemission_requestResolver {
  @TypeGraphQL.Query(_returns => Remission_request, {
    nullable: true
  })
  async remission_request(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindUniqueRemission_requestArgs): Promise<Remission_request | null> {
    return getPrismaFromContext(ctx).remission_request.findUnique(args);
  }
}
