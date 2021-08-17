import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Bbb_meetingCreateInput } from "../../../inputs/Bbb_meetingCreateInput";
import { Bbb_meetingUpdateInput } from "../../../inputs/Bbb_meetingUpdateInput";
import { Bbb_meetingWhereUniqueInput } from "../../../inputs/Bbb_meetingWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertBbb_meetingArgs {
  @TypeGraphQL.Field(_type => Bbb_meetingWhereUniqueInput, {
    nullable: false
  })
  where!: Bbb_meetingWhereUniqueInput;

  @TypeGraphQL.Field(_type => Bbb_meetingCreateInput, {
    nullable: false
  })
  create!: Bbb_meetingCreateInput;

  @TypeGraphQL.Field(_type => Bbb_meetingUpdateInput, {
    nullable: false
  })
  update!: Bbb_meetingUpdateInput;
}
