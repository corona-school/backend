import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateMentorArgs } from "./args/AggregateMentorArgs";
import { Mentor } from "../../../models/Mentor";
import { AggregateMentor } from "../../outputs/AggregateMentor";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Mentor)
export class AggregateMentorResolver {
  @TypeGraphQL.Query(_returns => AggregateMentor, {
    nullable: false
  })
  async aggregateMentor(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateMentorArgs): Promise<AggregateMentor> {
    return getPrismaFromContext(ctx).mentor.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
