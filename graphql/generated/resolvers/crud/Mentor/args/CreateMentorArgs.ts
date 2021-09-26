import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { MentorCreateInput } from "../../../inputs/MentorCreateInput";

@TypeGraphQL.ArgsType()
export class CreateMentorArgs {
  @TypeGraphQL.Field(_type => MentorCreateInput, {
    nullable: false
  })
  data!: MentorCreateInput;
}
