import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Expertise_tagCreateInput } from "../../../inputs/Expertise_tagCreateInput";
import { Expertise_tagUpdateInput } from "../../../inputs/Expertise_tagUpdateInput";
import { Expertise_tagWhereUniqueInput } from "../../../inputs/Expertise_tagWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertExpertise_tagArgs {
  @TypeGraphQL.Field(_type => Expertise_tagWhereUniqueInput, {
    nullable: false
  })
  where!: Expertise_tagWhereUniqueInput;

  @TypeGraphQL.Field(_type => Expertise_tagCreateInput, {
    nullable: false
  })
  create!: Expertise_tagCreateInput;

  @TypeGraphQL.Field(_type => Expertise_tagUpdateInput, {
    nullable: false
  })
  update!: Expertise_tagUpdateInput;
}
