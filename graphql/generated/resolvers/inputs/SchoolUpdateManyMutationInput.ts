import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BoolFieldUpdateOperationsInput } from "../inputs/BoolFieldUpdateOperationsInput";
import { DateTimeFieldUpdateOperationsInput } from "../inputs/DateTimeFieldUpdateOperationsInput";
import { Enumschool_schooltype_enumFieldUpdateOperationsInput } from "../inputs/Enumschool_schooltype_enumFieldUpdateOperationsInput";
import { NullableEnumschool_state_enumFieldUpdateOperationsInput } from "../inputs/NullableEnumschool_state_enumFieldUpdateOperationsInput";
import { NullableStringFieldUpdateOperationsInput } from "../inputs/NullableStringFieldUpdateOperationsInput";
import { StringFieldUpdateOperationsInput } from "../inputs/StringFieldUpdateOperationsInput";

@TypeGraphQL.InputType("SchoolUpdateManyMutationInput", {
  isAbstract: true
})
export class SchoolUpdateManyMutationInput {
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
  name?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableStringFieldUpdateOperationsInput, {
    nullable: true
  })
  website?: NullableStringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => StringFieldUpdateOperationsInput, {
    nullable: true
  })
  emailDomain?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableEnumschool_state_enumFieldUpdateOperationsInput, {
    nullable: true
  })
  state?: NullableEnumschool_state_enumFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => Enumschool_schooltype_enumFieldUpdateOperationsInput, {
    nullable: true
  })
  schooltype?: Enumschool_schooltype_enumFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => BoolFieldUpdateOperationsInput, {
    nullable: true
  })
  activeCooperation?: BoolFieldUpdateOperationsInput | undefined;
}
