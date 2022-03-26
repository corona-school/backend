import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Project_field_with_grade_restrictionCreateWithoutStudentInput } from "../inputs/Project_field_with_grade_restrictionCreateWithoutStudentInput";
import { Project_field_with_grade_restrictionUpdateWithoutStudentInput } from "../inputs/Project_field_with_grade_restrictionUpdateWithoutStudentInput";
import { Project_field_with_grade_restrictionWhereUniqueInput } from "../inputs/Project_field_with_grade_restrictionWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Project_field_with_grade_restrictionUpsertWithWhereUniqueWithoutStudentInput {
  @TypeGraphQL.Field(_type => Project_field_with_grade_restrictionWhereUniqueInput, {
    nullable: false
  })
  where!: Project_field_with_grade_restrictionWhereUniqueInput;

  @TypeGraphQL.Field(_type => Project_field_with_grade_restrictionUpdateWithoutStudentInput, {
    nullable: false
  })
  update!: Project_field_with_grade_restrictionUpdateWithoutStudentInput;

  @TypeGraphQL.Field(_type => Project_field_with_grade_restrictionCreateWithoutStudentInput, {
    nullable: false
  })
  create!: Project_field_with_grade_restrictionCreateWithoutStudentInput;
}
