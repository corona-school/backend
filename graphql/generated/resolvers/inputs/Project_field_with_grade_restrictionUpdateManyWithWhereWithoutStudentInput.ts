import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Project_field_with_grade_restrictionScalarWhereInput } from "../inputs/Project_field_with_grade_restrictionScalarWhereInput";
import { Project_field_with_grade_restrictionUpdateManyMutationInput } from "../inputs/Project_field_with_grade_restrictionUpdateManyMutationInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Project_field_with_grade_restrictionUpdateManyWithWhereWithoutStudentInput {
  @TypeGraphQL.Field(_type => Project_field_with_grade_restrictionScalarWhereInput, {
    nullable: false
  })
  where!: Project_field_with_grade_restrictionScalarWhereInput;

  @TypeGraphQL.Field(_type => Project_field_with_grade_restrictionUpdateManyMutationInput, {
    nullable: false
  })
  data!: Project_field_with_grade_restrictionUpdateManyMutationInput;
}
