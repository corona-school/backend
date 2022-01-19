import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateRemission_requestArgs } from "./args/AggregateRemission_requestArgs";
import { Remission_request } from "../../../models/Remission_request";
import { AggregateRemission_request } from "../../outputs/AggregateRemission_request";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Remission_request)
export class AggregateRemission_requestResolver {
  @TypeGraphQL.Query(_returns => AggregateRemission_request, {
    nullable: false
  })
  async aggregateRemission_request(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateRemission_requestArgs): Promise<AggregateRemission_request> {
    return getPrismaFromContext(ctx).remission_request.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
