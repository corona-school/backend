import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateWithoutProject_field_with_grade_restrictionInput } from "../inputs/StudentCreateWithoutProject_field_with_grade_restrictionInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType("StudentCreateOrConnectWithoutProject_field_with_grade_restrictionInput", {
  isAbstract: true
})
export class StudentCreateOrConnectWithoutProject_field_with_grade_restrictionInput {
  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: false
  })
  where!: StudentWhereUniqueInput;

  @TypeGraphQL.Field(_type => StudentCreateWithoutProject_field_with_grade_restrictionInput, {
    nullable: false
  })
  create!: StudentCreateWithoutProject_field_with_grade_restrictionInput;
}
