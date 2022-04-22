import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { DateTimeFieldUpdateOperationsInput } from "../inputs/DateTimeFieldUpdateOperationsInput";
import { StringFieldUpdateOperationsInput } from "../inputs/StringFieldUpdateOperationsInput";
import { StudentUpdateOneWithoutJufo_verification_transmissionInput } from "../inputs/StudentUpdateOneWithoutJufo_verification_transmissionInput";

@TypeGraphQL.InputType("Jufo_verification_transmissionUpdateInput", {
  isAbstract: true
})
export class Jufo_verification_transmissionUpdateInput {
  @TypeGraphQL.Field(_type => DateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  createdAt?: DateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => StringFieldUpdateOperationsInput, {
    nullable: true
  })
  uuid?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => StudentUpdateOneWithoutJufo_verification_transmissionInput, {
    nullable: true
  })
  student?: StudentUpdateOneWithoutJufo_verification_transmissionInput | undefined;
}
