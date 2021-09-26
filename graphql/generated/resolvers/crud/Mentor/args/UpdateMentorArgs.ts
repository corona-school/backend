import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { MentorUpdateInput } from "../../../inputs/MentorUpdateInput";
import { MentorWhereUniqueInput } from "../../../inputs/MentorWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateMentorArgs {
  @TypeGraphQL.Field(_type => MentorUpdateInput, {
    nullable: false
  })
  data!: MentorUpdateInput;

  @TypeGraphQL.Field(_type => MentorWhereUniqueInput, {
    nullable: false
  })
  where!: MentorWhereUniqueInput;
}
