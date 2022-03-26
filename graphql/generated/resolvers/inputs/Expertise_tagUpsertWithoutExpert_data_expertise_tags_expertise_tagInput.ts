import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expertise_tagCreateWithoutExpert_data_expertise_tags_expertise_tagInput } from "../inputs/Expertise_tagCreateWithoutExpert_data_expertise_tags_expertise_tagInput";
import { Expertise_tagUpdateWithoutExpert_data_expertise_tags_expertise_tagInput } from "../inputs/Expertise_tagUpdateWithoutExpert_data_expertise_tags_expertise_tagInput";

@TypeGraphQL.InputType("Expertise_tagUpsertWithoutExpert_data_expertise_tags_expertise_tagInput", {
  isAbstract: true
})
export class Expertise_tagUpsertWithoutExpert_data_expertise_tags_expertise_tagInput {
  @TypeGraphQL.Field(_type => Expertise_tagUpdateWithoutExpert_data_expertise_tags_expertise_tagInput, {
    nullable: false
  })
  update!: Expertise_tagUpdateWithoutExpert_data_expertise_tags_expertise_tagInput;

  @TypeGraphQL.Field(_type => Expertise_tagCreateWithoutExpert_data_expertise_tags_expertise_tagInput, {
    nullable: false
  })
  create!: Expertise_tagCreateWithoutExpert_data_expertise_tags_expertise_tagInput;
}
