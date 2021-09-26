import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Expertise_tagUpdateInput } from "../../../inputs/Expertise_tagUpdateInput";
import { Expertise_tagWhereUniqueInput } from "../../../inputs/Expertise_tagWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateExpertise_tagArgs {
  @TypeGraphQL.Field(_type => Expertise_tagUpdateInput, {
    nullable: false
  })
  data!: Expertise_tagUpdateInput;

  @TypeGraphQL.Field(_type => Expertise_tagWhereUniqueInput, {
    nullable: false
  })
  where!: Expertise_tagWhereUniqueInput;
}
