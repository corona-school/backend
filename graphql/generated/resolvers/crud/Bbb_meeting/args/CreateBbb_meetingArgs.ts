import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Bbb_meetingCreateInput } from "../../../inputs/Bbb_meetingCreateInput";

@TypeGraphQL.ArgsType()
export class CreateBbb_meetingArgs {
  @TypeGraphQL.Field(_type => Bbb_meetingCreateInput, {
    nullable: false
  })
  data!: Bbb_meetingCreateInput;
}
