import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Bbb_meetingWhereUniqueInput } from "../../../inputs/Bbb_meetingWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class FindUniqueBbb_meetingArgs {
  @TypeGraphQL.Field(_type => Bbb_meetingWhereUniqueInput, {
    nullable: false
  })
  where!: Bbb_meetingWhereUniqueInput;
}
