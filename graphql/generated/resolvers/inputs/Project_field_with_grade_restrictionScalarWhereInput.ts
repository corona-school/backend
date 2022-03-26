import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { DateTimeFilter } from "../inputs/DateTimeFilter";
import { Enumproject_field_with_grade_restriction_projectfield_enumFilter } from "../inputs/Enumproject_field_with_grade_restriction_projectfield_enumFilter";
import { IntFilter } from "../inputs/IntFilter";
import { IntNullableFilter } from "../inputs/IntNullableFilter";

@TypeGraphQL.InputType("Project_field_with_grade_restrictionScalarWhereInput", {
  isAbstract: true
})
export class Project_field_with_grade_restrictionScalarWhereInput {
  @TypeGraphQL.Field(_type => [Project_field_with_grade_restrictionScalarWhereInput], {
    nullable: true
  })
  AND?: Project_field_with_grade_restrictionScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_field_with_grade_restrictionScalarWhereInput], {
    nullable: true
  })
  OR?: Project_field_with_grade_restrictionScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_field_with_grade_restrictionScalarWhereInput], {
    nullable: true
  })
  NOT?: Project_field_with_grade_restrictionScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  id?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeFilter, {
    nullable: true
  })
  createdAt?: DateTimeFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeFilter, {
    nullable: true
  })
  updatedAt?: DateTimeFilter | undefined;

  @TypeGraphQL.Field(_type => Enumproject_field_with_grade_restriction_projectfield_enumFilter, {
    nullable: true
  })
  projectField?: Enumproject_field_with_grade_restriction_projectfield_enumFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true
  })
  min?: IntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true
  })
  max?: IntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  studentId?: IntFilter | undefined;
}
