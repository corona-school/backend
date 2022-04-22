import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { student_registrationsource_enum } from "../../enums/student_registrationsource_enum";

@TypeGraphQL.InputType("Enumstudent_registrationsource_enumFieldUpdateOperationsInput", {
  isAbstract: true
})
export class Enumstudent_registrationsource_enumFieldUpdateOperationsInput {
  @TypeGraphQL.Field(_type => student_registrationsource_enum, {
    nullable: true
  })
  set?: "normal" | "cooperation" | "drehtuer" | "other" | "codu" | "plus" | undefined;
}
