import * as TypeGraphQL from "type-graphql";
import graphqlFields from "graphql-fields";
import { GraphQLResolveInfo } from "graphql";
import { CreateBbb_meetingArgs } from "./args/CreateBbb_meetingArgs";
import { Bbb_meeting } from "../../../models/Bbb_meeting";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../helpers";

@TypeGraphQL.Resolver(_of => Bbb_meeting)
export class CreateBbb_meetingResolver {
  @TypeGraphQL.Mutation(_returns => Bbb_meeting, {
    nullable: false
  })
  async createBbb_meeting(@TypeGraphQL.Ctx() ctx: any, @TypeGraphQL.Info() info: GraphQLResolveInfo, @TypeGraphQL.Args() args: CreateBbb_meetingArgs): Promise<Bbb_meeting> {
    const { _count } = transformFields(
      graphqlFields(info as any)
    );
    return getPrismaFromContext(ctx).bbb_meeting.create({
      ...args,
      ...(_count && transformCountFieldIntoSelectRelationsCount(_count)),
    });
  }
}
