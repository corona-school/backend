import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BoolFieldUpdateOperationsInput } from "../inputs/BoolFieldUpdateOperationsInput";
import { DateTimeFieldUpdateOperationsInput } from "../inputs/DateTimeFieldUpdateOperationsInput";
import { Enumexpert_data_allowed_enumFieldUpdateOperationsInput } from "../inputs/Enumexpert_data_allowed_enumFieldUpdateOperationsInput";
import { Expert_data_expertise_tags_expertise_tagUpdateManyWithoutExpert_dataInput } from "../inputs/Expert_data_expertise_tags_expertise_tagUpdateManyWithoutExpert_dataInput";
import { NullableStringFieldUpdateOperationsInput } from "../inputs/NullableStringFieldUpdateOperationsInput";
import { StringFieldUpdateOperationsInput } from "../inputs/StringFieldUpdateOperationsInput";
import { StudentUpdateOneWithoutExpert_dataInput } from "../inputs/StudentUpdateOneWithoutExpert_dataInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Expert_dataUpdateInput {
  @TypeGraphQL.Field(_type => DateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  createdAt?: DateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => DateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  updatedAt?: DateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => StringFieldUpdateOperationsInput, {
    nullable: true
  })
  contactEmail?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableStringFieldUpdateOperationsInput, {
    nullable: true
  })
  description?: NullableStringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => BoolFieldUpdateOperationsInput, {
    nullable: true
  })
  active?: BoolFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => Enumexpert_data_allowed_enumFieldUpdateOperationsInput, {
    nullable: true
  })
  allowed?: Enumexpert_data_allowed_enumFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => StudentUpdateOneWithoutExpert_dataInput, {
    nullable: true
  })
  student?: StudentUpdateOneWithoutExpert_dataInput | undefined;

  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagUpdateManyWithoutExpert_dataInput, {
    nullable: true
  })
  expert_data_expertise_tags_expertise_tag?: Expert_data_expertise_tags_expertise_tagUpdateManyWithoutExpert_dataInput | undefined;
}
