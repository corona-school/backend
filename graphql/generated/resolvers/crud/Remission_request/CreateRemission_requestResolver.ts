import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { CreateRemission_requestArgs } from "./args/CreateRemission_requestArgs";
import { Remission_request } from "../../../models/Remission_request";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Remission_request)
export class CreateRemission_requestResolver {
  @TypeGraphQL.Mutation(_returns => Remission_request, {
    nullable: false
  })
  async createRemission_request(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateRemission_requestArgs): Promise<Remission_request> {
    return getPrismaFromContext(ctx).remission_request.create(args);
  }
}
