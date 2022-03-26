import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BoolFilter } from "../inputs/BoolFilter";
import { DateTimeFilter } from "../inputs/DateTimeFilter";
import { Enumcourse_category_enumFilter } from "../inputs/Enumcourse_category_enumFilter";
import { Enumcourse_coursestate_enumFilter } from "../inputs/Enumcourse_coursestate_enumFilter";
import { IntFilter } from "../inputs/IntFilter";
import { IntNullableFilter } from "../inputs/IntNullableFilter";
import { StringFilter } from "../inputs/StringFilter";
import { StringNullableFilter } from "../inputs/StringNullableFilter";

@TypeGraphQL.InputType("CourseScalarWhereInput", {
  isAbstract: true
})
export class CourseScalarWhereInput {
  @TypeGraphQL.Field(_type => [CourseScalarWhereInput], {
    nullable: true
  })
  AND?: CourseScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [CourseScalarWhereInput], {
    nullable: true
  })
  OR?: CourseScalarWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [CourseScalarWhereInput], {
    nullable: true
  })
  NOT?: CourseScalarWhereInput[] | undefined;

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

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  name?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  outline?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  description?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  imageKey?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => Enumcourse_category_enumFilter, {
    nullable: true
  })
  category?: Enumcourse_category_enumFilter | undefined;

  @TypeGraphQL.Field(_type => Enumcourse_coursestate_enumFilter, {
    nullable: true
  })
  courseState?: Enumcourse_coursestate_enumFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  screeningComment?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  publicRanking?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => BoolFilter, {
    nullable: true
  })
  allowContact?: BoolFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true
  })
  correspondentId?: IntNullableFilter | undefined;
}
