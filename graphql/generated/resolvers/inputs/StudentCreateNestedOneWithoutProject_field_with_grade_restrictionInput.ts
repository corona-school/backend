import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateOrConnectWithoutProject_field_with_grade_restrictionInput } from "../inputs/StudentCreateOrConnectWithoutProject_field_with_grade_restrictionInput";
import { StudentCreateWithoutProject_field_with_grade_restrictionInput } from "../inputs/StudentCreateWithoutProject_field_with_grade_restrictionInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType("StudentCreateNestedOneWithoutProject_field_with_grade_restrictionInput", {
  isAbstract: true
})
export class StudentCreateNestedOneWithoutProject_field_with_grade_restrictionInput {
  @TypeGraphQL.Field(_type => StudentCreateWithoutProject_field_with_grade_restrictionInput, {
    nullable: true
  })
  create?: StudentCreateWithoutProject_field_with_grade_restrictionInput | undefined;

  @TypeGraphQL.Field(_type => StudentCreateOrConnectWithoutProject_field_with_grade_restrictionInput, {
    nullable: true
  })
  connectOrCreate?: StudentCreateOrConnectWithoutProject_field_with_grade_restrictionInput | undefined;

  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: true
  })
  connect?: StudentWhereUniqueInput | undefined;
}
