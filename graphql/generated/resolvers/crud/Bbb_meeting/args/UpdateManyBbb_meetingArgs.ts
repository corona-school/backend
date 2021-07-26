import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Bbb_meetingUpdateManyMutationInput } from "../../../inputs/Bbb_meetingUpdateManyMutationInput";
import { Bbb_meetingWhereInput } from "../../../inputs/Bbb_meetingWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyBbb_meetingArgs {
  @TypeGraphQL.Field(_type => Bbb_meetingUpdateManyMutationInput, {
    nullable: false
  })
  data!: Bbb_meetingUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => Bbb_meetingWhereInput, {
    nullable: true
  })
  where?: Bbb_meetingWhereInput | undefined;
}
