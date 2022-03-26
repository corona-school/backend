import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { student_module_enum } from "../../enums/student_module_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class NullableEnumstudent_module_enumFieldUpdateOperationsInput {
  @TypeGraphQL.Field(_type => student_module_enum, {
    nullable: true
  })
  set?: "internship" | "seminar" | "other" | undefined;
}
