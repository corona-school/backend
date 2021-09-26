import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Bbb_meetingUpdateInput } from "../../../inputs/Bbb_meetingUpdateInput";
import { Bbb_meetingWhereUniqueInput } from "../../../inputs/Bbb_meetingWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateBbb_meetingArgs {
  @TypeGraphQL.Field(_type => Bbb_meetingUpdateInput, {
    nullable: false
  })
  data!: Bbb_meetingUpdateInput;

  @TypeGraphQL.Field(_type => Bbb_meetingWhereUniqueInput, {
    nullable: false
  })
  where!: Bbb_meetingWhereUniqueInput;
}
