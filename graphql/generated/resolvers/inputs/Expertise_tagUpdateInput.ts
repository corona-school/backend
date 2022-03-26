import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expert_data_expertise_tags_expertise_tagUpdateManyWithoutExpertise_tagInput } from "../inputs/Expert_data_expertise_tags_expertise_tagUpdateManyWithoutExpertise_tagInput";
import { StringFieldUpdateOperationsInput } from "../inputs/StringFieldUpdateOperationsInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Expertise_tagUpdateInput {
  @TypeGraphQL.Field(_type => StringFieldUpdateOperationsInput, {
    nullable: true
  })
  name?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagUpdateManyWithoutExpertise_tagInput, {
    nullable: true
  })
  expert_data_expertise_tags_expertise_tag?: Expert_data_expertise_tags_expertise_tagUpdateManyWithoutExpertise_tagInput | undefined;
}
