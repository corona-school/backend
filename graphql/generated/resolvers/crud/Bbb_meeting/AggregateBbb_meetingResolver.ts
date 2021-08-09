import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { AggregateBbb_meetingArgs } from "./args/AggregateBbb_meetingArgs";
import { Bbb_meeting } from "../../../models/Bbb_meeting";
import { AggregateBbb_meeting } from "../../outputs/AggregateBbb_meeting";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Bbb_meeting)
export class AggregateBbb_meetingResolver {
  @TypeGraphQL.Query(_returns => AggregateBbb_meeting, {
    nullable: false
  })
  async aggregateBbb_meeting(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: AggregateBbb_meetingArgs): Promise<AggregateBbb_meeting> {
    return getPrismaFromContext(ctx).bbb_meeting.aggregate({
      ...args,
      ...transformFields(graphqlFields(info as any)),
    });
  }
}
