import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expert_data_expertise_tags_expertise_tagUpdateWithoutExpert_dataInput } from "../inputs/Expert_data_expertise_tags_expertise_tagUpdateWithoutExpert_dataInput";
import { Expert_data_expertise_tags_expertise_tagWhereUniqueInput } from "../inputs/Expert_data_expertise_tags_expertise_tagWhereUniqueInput";

@TypeGraphQL.InputType("Expert_data_expertise_tags_expertise_tagUpdateWithWhereUniqueWithoutExpert_dataInput", {
  isAbstract: true
})
export class Expert_data_expertise_tags_expertise_tagUpdateWithWhereUniqueWithoutExpert_dataInput {
  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagWhereUniqueInput, {
    nullable: false
  })
  where!: Expert_data_expertise_tags_expertise_tagWhereUniqueInput;

  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagUpdateWithoutExpert_dataInput, {
    nullable: false
  })
  data!: Expert_data_expertise_tags_expertise_tagUpdateWithoutExpert_dataInput;
}
