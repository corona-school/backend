import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Bbb_meetingCreateManyInput } from "../../../inputs/Bbb_meetingCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyBbb_meetingArgs {
  @TypeGraphQL.Field(_type => [Bbb_meetingCreateManyInput], {
    nullable: false
  })
  data!: Bbb_meetingCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
