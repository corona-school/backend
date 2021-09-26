import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateMatchArgs } from "./args/AggregateMatchArgs";
import { Match } from "../../../models/Match";
import { AggregateMatch } from "../../outputs/AggregateMatch";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Match)
export class AggregateMatchResolver {
  @TypeGraphQL.Query(_returns => AggregateMatch, {
    nullable: false
  })
  async aggregateMatch(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateMatchArgs): Promise<AggregateMatch> {
    return getPrismaFromContext(ctx).match.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
