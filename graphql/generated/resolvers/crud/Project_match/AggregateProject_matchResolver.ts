import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateProject_matchArgs } from "./args/AggregateProject_matchArgs";
import { Project_match } from "../../../models/Project_match";
import { AggregateProject_match } from "../../outputs/AggregateProject_match";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Project_match)
export class AggregateProject_matchResolver {
  @TypeGraphQL.Query(_returns => AggregateProject_match, {
    nullable: false
  })
  async aggregateProject_match(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateProject_matchArgs): Promise<AggregateProject_match> {
    return getPrismaFromContext(ctx).project_match.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
