import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Expertise_tagCreateInput } from "../../../inputs/Expertise_tagCreateInput";

@TypeGraphQL.ArgsType()
export class CreateExpertise_tagArgs {
  @TypeGraphQL.Field(_type => Expertise_tagCreateInput, {
    nullable: false
  })
  data!: Expertise_tagCreateInput;
}
