import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expert_dataUpdateOneRequiredWithoutExpert_data_expertise_tags_expertise_tagInput } from "../inputs/Expert_dataUpdateOneRequiredWithoutExpert_data_expertise_tags_expertise_tagInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Expert_data_expertise_tags_expertise_tagUpdateWithoutExpertise_tagInput {
  @TypeGraphQL.Field(_type => Expert_dataUpdateOneRequiredWithoutExpert_data_expertise_tags_expertise_tagInput, {
    nullable: true
  })
  expert_data?: Expert_dataUpdateOneRequiredWithoutExpert_data_expertise_tags_expertise_tagInput | undefined;
}
