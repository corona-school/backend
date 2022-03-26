import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { course_coursestate_enum } from "../../enums/course_coursestate_enum";

@TypeGraphQL.InputType("Enumcourse_coursestate_enumFieldUpdateOperationsInput", {
  isAbstract: true
})
export class Enumcourse_coursestate_enumFieldUpdateOperationsInput {
  @TypeGraphQL.Field(_type => course_coursestate_enum, {
    nullable: true
  })
  set?: "created" | "submitted" | "allowed" | "denied" | "cancelled" | undefined;
}
