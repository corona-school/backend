import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expertise_tagCreateNestedOneWithoutExpert_data_expertise_tags_expertise_tagInput } from "../inputs/Expertise_tagCreateNestedOneWithoutExpert_data_expertise_tags_expertise_tagInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Expert_data_expertise_tags_expertise_tagCreateWithoutExpert_dataInput {
  @TypeGraphQL.Field(_type => Expertise_tagCreateNestedOneWithoutExpert_data_expertise_tags_expertise_tagInput, {
    nullable: false
  })
  expertise_tag!: Expertise_tagCreateNestedOneWithoutExpert_data_expertise_tags_expertise_tagInput;
}
