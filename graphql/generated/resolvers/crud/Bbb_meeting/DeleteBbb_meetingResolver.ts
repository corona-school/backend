import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { DeleteBbb_meetingArgs } from "./args/DeleteBbb_meetingArgs";
import { Bbb_meeting } from "../../../models/Bbb_meeting";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Bbb_meeting)
export class DeleteBbb_meetingResolver {
  @TypeGraphQL.Mutation(_returns => Bbb_meeting, {
    nullable: true
  })
  async deleteBbb_meeting(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: DeleteBbb_meetingArgs): Promise<Bbb_meeting | null> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).bbb_meeting.delete({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
