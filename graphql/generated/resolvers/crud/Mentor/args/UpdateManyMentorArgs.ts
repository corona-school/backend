import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { MentorUpdateManyMutationInput } from "../../../inputs/MentorUpdateManyMutationInput";
import { MentorWhereInput } from "../../../inputs/MentorWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyMentorArgs {
  @TypeGraphQL.Field(_type => MentorUpdateManyMutationInput, {
    nullable: false
  })
  data!: MentorUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => MentorWhereInput, {
    nullable: true
  })
  where?: MentorWhereInput | undefined;
}
