import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Bbb_meetingWhereInput } from "../../../inputs/Bbb_meetingWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyBbb_meetingArgs {
  @TypeGraphQL.Field(_type => Bbb_meetingWhereInput, {
    nullable: true
  })
  where?: Bbb_meetingWhereInput | undefined;
}
