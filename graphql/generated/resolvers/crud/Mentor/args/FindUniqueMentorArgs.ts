import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { MentorWhereUniqueInput } from "../../../inputs/MentorWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class FindUniqueMentorArgs {
  @TypeGraphQL.Field(_type => MentorWhereUniqueInput, {
    nullable: false
  })
  where!: MentorWhereUniqueInput;
}
