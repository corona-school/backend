import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { DateTimeFieldUpdateOperationsInput } from "../inputs/DateTimeFieldUpdateOperationsInput";
import { Enumproject_field_with_grade_restriction_projectfield_enumFieldUpdateOperationsInput } from "../inputs/Enumproject_field_with_grade_restriction_projectfield_enumFieldUpdateOperationsInput";
import { NullableIntFieldUpdateOperationsInput } from "../inputs/NullableIntFieldUpdateOperationsInput";

@TypeGraphQL.InputType("Project_field_with_grade_restrictionUpdateWithoutStudentInput", {
  isAbstract: true
})
export class Project_field_with_grade_restrictionUpdateWithoutStudentInput {
  @TypeGraphQL.Field(_type => DateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  createdAt?: DateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => DateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  updatedAt?: DateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => Enumproject_field_with_grade_restriction_projectfield_enumFieldUpdateOperationsInput, {
    nullable: true
  })
  projectField?: Enumproject_field_with_grade_restriction_projectfield_enumFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableIntFieldUpdateOperationsInput, {
    nullable: true
  })
  min?: NullableIntFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableIntFieldUpdateOperationsInput, {
    nullable: true
  })
  max?: NullableIntFieldUpdateOperationsInput | undefined;
}
