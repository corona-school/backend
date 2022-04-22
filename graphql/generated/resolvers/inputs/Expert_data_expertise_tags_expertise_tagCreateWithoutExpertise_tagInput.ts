import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expert_dataCreateNestedOneWithoutExpert_data_expertise_tags_expertise_tagInput } from "../inputs/Expert_dataCreateNestedOneWithoutExpert_data_expertise_tags_expertise_tagInput";

@TypeGraphQL.InputType("Expert_data_expertise_tags_expertise_tagCreateWithoutExpertise_tagInput", {
  isAbstract: true
})
export class Expert_data_expertise_tags_expertise_tagCreateWithoutExpertise_tagInput {
  @TypeGraphQL.Field(_type => Expert_dataCreateNestedOneWithoutExpert_data_expertise_tags_expertise_tagInput, {
    nullable: false
  })
  expert_data!: Expert_dataCreateNestedOneWithoutExpert_data_expertise_tags_expertise_tagInput;
}
