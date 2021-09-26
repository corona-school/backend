import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { FindFirstBbb_meetingArgs } from "./args/FindFirstBbb_meetingArgs";
import { Bbb_meeting } from "../../../models/Bbb_meeting";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Bbb_meeting)
export class FindFirstBbb_meetingResolver {
  @TypeGraphQL.Query(_returns => Bbb_meeting, {
    nullable: true
  })
  async findFirstBbb_meeting(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindFirstBbb_meetingArgs): Promise<Bbb_meeting | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).bbb_meeting.findFirst({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
