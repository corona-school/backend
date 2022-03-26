import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { DateTimeWithAggregatesFilter } from "../inputs/DateTimeWithAggregatesFilter";
import { Enumproject_field_with_grade_restriction_projectfield_enumWithAggregatesFilter } from "../inputs/Enumproject_field_with_grade_restriction_projectfield_enumWithAggregatesFilter";
import { IntNullableWithAggregatesFilter } from "../inputs/IntNullableWithAggregatesFilter";
import { IntWithAggregatesFilter } from "../inputs/IntWithAggregatesFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Project_field_with_grade_restrictionScalarWhereWithAggregatesInput {
  @TypeGraphQL.Field(_type => [Project_field_with_grade_restrictionScalarWhereWithAggregatesInput], {
    nullable: true
  })
  AND?: Project_field_with_grade_restrictionScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_field_with_grade_restrictionScalarWhereWithAggregatesInput], {
    nullable: true
  })
  OR?: Project_field_with_grade_restrictionScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_field_with_grade_restrictionScalarWhereWithAggregatesInput], {
    nullable: true
  })
  NOT?: Project_field_with_grade_restrictionScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  id?: IntWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeWithAggregatesFilter, {
    nullable: true
  })
  createdAt?: DateTimeWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeWithAggregatesFilter, {
    nullable: true
  })
  updatedAt?: DateTimeWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => Enumproject_field_with_grade_restriction_projectfield_enumWithAggregatesFilter, {
    nullable: true
  })
  projectField?: Enumproject_field_with_grade_restriction_projectfield_enumWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableWithAggregatesFilter, {
    nullable: true
  })
  min?: IntNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableWithAggregatesFilter, {
    nullable: true
  })
  max?: IntNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  studentId?: IntWithAggregatesFilter | undefined;
}
