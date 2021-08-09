import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expertise_tagUpdateOneRequiredWithoutExpert_data_expertise_tags_expertise_tagInput } from "../inputs/Expertise_tagUpdateOneRequiredWithoutExpert_data_expertise_tags_expertise_tagInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Expert_data_expertise_tags_expertise_tagUpdateWithoutExpert_dataInput {
  @TypeGraphQL.Field(_type => Expertise_tagUpdateOneRequiredWithoutExpert_data_expertise_tags_expertise_tagInput, {
    nullable: true
  })
  expertise_tag?: Expertise_tagUpdateOneRequiredWithoutExpert_data_expertise_tags_expertise_tagInput | undefined;
}
