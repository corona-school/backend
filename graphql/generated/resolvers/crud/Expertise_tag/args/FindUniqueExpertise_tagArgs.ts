import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Expertise_tagWhereUniqueInput } from "../../../inputs/Expertise_tagWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class FindUniqueExpertise_tagArgs {
  @TypeGraphQL.Field(_type => Expertise_tagWhereUniqueInput, {
    nullable: false
  })
  where!: Expertise_tagWhereUniqueInput;
}
