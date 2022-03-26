import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { DateTimeFieldUpdateOperationsInput } from "../inputs/DateTimeFieldUpdateOperationsInput";
import { Enumlog_logtype_enumFieldUpdateOperationsInput } from "../inputs/Enumlog_logtype_enumFieldUpdateOperationsInput";
import { StringFieldUpdateOperationsInput } from "../inputs/StringFieldUpdateOperationsInput";

@TypeGraphQL.InputType("LogUpdateManyMutationInput", {
  isAbstract: true
})
export class LogUpdateManyMutationInput {
  @TypeGraphQL.Field(_type => Enumlog_logtype_enumFieldUpdateOperationsInput, {
    nullable: true
  })
  logtype?: Enumlog_logtype_enumFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => DateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  createdAt?: DateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => StringFieldUpdateOperationsInput, {
    nullable: true
  })
  user?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => StringFieldUpdateOperationsInput, {
    nullable: true
  })
  data?: StringFieldUpdateOperationsInput | undefined;
}
