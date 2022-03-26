import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateWithoutProject_field_with_grade_restrictionInput } from "../inputs/StudentCreateWithoutProject_field_with_grade_restrictionInput";
import { StudentUpdateWithoutProject_field_with_grade_restrictionInput } from "../inputs/StudentUpdateWithoutProject_field_with_grade_restrictionInput";

@TypeGraphQL.InputType("StudentUpsertWithoutProject_field_with_grade_restrictionInput", {
  isAbstract: true
})
export class StudentUpsertWithoutProject_field_with_grade_restrictionInput {
  @TypeGraphQL.Field(_type => StudentUpdateWithoutProject_field_with_grade_restrictionInput, {
    nullable: false
  })
  update!: StudentUpdateWithoutProject_field_with_grade_restrictionInput;

  @TypeGraphQL.Field(_type => StudentCreateWithoutProject_field_with_grade_restrictionInput, {
    nullable: false
  })
  create!: StudentCreateWithoutProject_field_with_grade_restrictionInput;
}
