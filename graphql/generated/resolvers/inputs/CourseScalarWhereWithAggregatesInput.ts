import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BoolWithAggregatesFilter } from "../inputs/BoolWithAggregatesFilter";
import { DateTimeWithAggregatesFilter } from "../inputs/DateTimeWithAggregatesFilter";
import { Enumcourse_category_enumWithAggregatesFilter } from "../inputs/Enumcourse_category_enumWithAggregatesFilter";
import { Enumcourse_coursestate_enumWithAggregatesFilter } from "../inputs/Enumcourse_coursestate_enumWithAggregatesFilter";
import { IntNullableWithAggregatesFilter } from "../inputs/IntNullableWithAggregatesFilter";
import { IntWithAggregatesFilter } from "../inputs/IntWithAggregatesFilter";
import { StringNullableWithAggregatesFilter } from "../inputs/StringNullableWithAggregatesFilter";
import { StringWithAggregatesFilter } from "../inputs/StringWithAggregatesFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class CourseScalarWhereWithAggregatesInput {
  @TypeGraphQL.Field(_type => [CourseScalarWhereWithAggregatesInput], {
    nullable: true
  })
  AND?: CourseScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [CourseScalarWhereWithAggregatesInput], {
    nullable: true
  })
  OR?: CourseScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [CourseScalarWhereWithAggregatesInput], {
    nullable: true
  })
  NOT?: CourseScalarWhereWithAggregatesInput[] | undefined;

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

  @TypeGraphQL.Field(_type => StringWithAggregatesFilter, {
    nullable: true
  })
  name?: StringWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringWithAggregatesFilter, {
    nullable: true
  })
  outline?: StringWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringWithAggregatesFilter, {
    nullable: true
  })
  description?: StringWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableWithAggregatesFilter, {
    nullable: true
  })
  imageKey?: StringNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => Enumcourse_coursestate_enumWithAggregatesFilter, {
    nullable: true
  })
  courseState?: Enumcourse_coursestate_enumWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => Enumcourse_category_enumWithAggregatesFilter, {
    nullable: true
  })
  category?: Enumcourse_category_enumWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableWithAggregatesFilter, {
    nullable: true
  })
  screeningComment?: StringNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  publicRanking?: IntWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => BoolWithAggregatesFilter, {
    nullable: true
  })
  allowContact?: BoolWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableWithAggregatesFilter, {
    nullable: true
  })
  correspondentId?: IntNullableWithAggregatesFilter | undefined;
}
