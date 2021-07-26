import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { FindUniqueBbb_meetingArgs } from "./args/FindUniqueBbb_meetingArgs";
import { Bbb_meeting } from "../../../models/Bbb_meeting";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Bbb_meeting)
export class FindUniqueBbb_meetingResolver {
  @TypeGraphQL.Query(_returns => Bbb_meeting, {
    nullable: true
  })
  async bbb_meeting(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: FindUniqueBbb_meetingArgs): Promise<Bbb_meeting | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).bbb_meeting.findUnique({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
