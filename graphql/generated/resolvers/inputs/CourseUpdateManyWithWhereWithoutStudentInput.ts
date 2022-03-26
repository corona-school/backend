import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseScalarWhereInput } from "../inputs/CourseScalarWhereInput";
import { CourseUpdateManyMutationInput } from "../inputs/CourseUpdateManyMutationInput";

@TypeGraphQL.InputType("CourseUpdateManyWithWhereWithoutStudentInput", {
  isAbstract: true
})
export class CourseUpdateManyWithWhereWithoutStudentInput {
  @TypeGraphQL.Field(_type => CourseScalarWhereInput, {
    nullable: false
  })
  where!: CourseScalarWhereInput;

  @TypeGraphQL.Field(_type => CourseUpdateManyMutationInput, {
    nullable: false
  })
  data!: CourseUpdateManyMutationInput;
}
