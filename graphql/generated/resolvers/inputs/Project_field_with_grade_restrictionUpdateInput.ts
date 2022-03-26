import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { DateTimeFieldUpdateOperationsInput } from "../inputs/DateTimeFieldUpdateOperationsInput";
import { Enumproject_field_with_grade_restriction_projectfield_enumFieldUpdateOperationsInput } from "../inputs/Enumproject_field_with_grade_restriction_projectfield_enumFieldUpdateOperationsInput";
import { NullableIntFieldUpdateOperationsInput } from "../inputs/NullableIntFieldUpdateOperationsInput";
import { StudentUpdateOneRequiredWithoutProject_field_with_grade_restrictionInput } from "../inputs/StudentUpdateOneRequiredWithoutProject_field_with_grade_restrictionInput";

@TypeGraphQL.InputType("Project_field_with_grade_restrictionUpdateInput", {
  isAbstract: true
})
export class Project_field_with_grade_restrictionUpdateInput {
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

  @TypeGraphQL.Field(_type => StudentUpdateOneRequiredWithoutProject_field_with_grade_restrictionInput, {
    nullable: true
  })
  student?: StudentUpdateOneRequiredWithoutProject_field_with_grade_restrictionInput | undefined;
}
