import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { GroupByBbb_meetingArgs } from "./args/GroupByBbb_meetingArgs";
import { Bbb_meeting } from "../../../models/Bbb_meeting";
import { Bbb_meetingGroupBy } from "../../outputs/Bbb_meetingGroupBy";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Bbb_meeting)
export class GroupByBbb_meetingResolver {
  @TypeGraphQL.Query(_returns => [Bbb_meetingGroupBy], {
    nullable: false
  })
  async groupByBbb_meeting(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: GroupByBbb_meetingArgs): Promise<Bbb_meetingGroupBy[]> {
    const { _count, _avg, _sum, _min, _max } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).bbb_meeting.groupBy({
      ...args,
      ...Object.fromEntries(
        Object.entries({ _count, _avg, _sum, _min, _max }).filter(([_, v]) => v != null)
      ),
    });
  }
}
