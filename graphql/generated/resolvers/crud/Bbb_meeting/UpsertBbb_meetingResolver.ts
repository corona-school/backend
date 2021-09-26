import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { UpsertBbb_meetingArgs } from "./args/UpsertBbb_meetingArgs";
import { Bbb_meeting } from "../../../models/Bbb_meeting";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Bbb_meeting)
export class UpsertBbb_meetingResolver {
  @TypeGraphQL.Mutation(_returns => Bbb_meeting, {
    nullable: false
  })
  async upsertBbb_meeting(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: UpsertBbb_meetingArgs): Promise<Bbb_meeting> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).bbb_meeting.upsert({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
