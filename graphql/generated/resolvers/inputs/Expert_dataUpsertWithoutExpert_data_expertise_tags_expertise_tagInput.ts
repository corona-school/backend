import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expert_dataCreateWithoutExpert_data_expertise_tags_expertise_tagInput } from "../inputs/Expert_dataCreateWithoutExpert_data_expertise_tags_expertise_tagInput";
import { Expert_dataUpdateWithoutExpert_data_expertise_tags_expertise_tagInput } from "../inputs/Expert_dataUpdateWithoutExpert_data_expertise_tags_expertise_tagInput";

@TypeGraphQL.InputType("Expert_dataUpsertWithoutExpert_data_expertise_tags_expertise_tagInput", {
  isAbstract: true
})
export class Expert_dataUpsertWithoutExpert_data_expertise_tags_expertise_tagInput {
  @TypeGraphQL.Field(_type => Expert_dataUpdateWithoutExpert_data_expertise_tags_expertise_tagInput, {
    nullable: false
  })
  update!: Expert_dataUpdateWithoutExpert_data_expertise_tags_expertise_tagInput;

  @TypeGraphQL.Field(_type => Expert_dataCreateWithoutExpert_data_expertise_tags_expertise_tagInput, {
    nullable: false
  })
  create!: Expert_dataCreateWithoutExpert_data_expertise_tags_expertise_tagInput;
}
