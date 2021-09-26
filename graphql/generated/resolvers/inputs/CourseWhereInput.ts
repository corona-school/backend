import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BoolFilter } from "../inputs/BoolFilter";
import { Course_guestListRelationFilter } from "../inputs/Course_guestListRelationFilter";
import { Course_instructors_studentListRelationFilter } from "../inputs/Course_instructors_studentListRelationFilter";
import { Course_tags_course_tagListRelationFilter } from "../inputs/Course_tags_course_tagListRelationFilter";
import { DateTimeFilter } from "../inputs/DateTimeFilter";
import { Enumcourse_category_enumFilter } from "../inputs/Enumcourse_category_enumFilter";
import { Enumcourse_coursestate_enumFilter } from "../inputs/Enumcourse_coursestate_enumFilter";
import { IntFilter } from "../inputs/IntFilter";
import { IntNullableFilter } from "../inputs/IntNullableFilter";
import { StringFilter } from "../inputs/StringFilter";
import { StringNullableFilter } from "../inputs/StringNullableFilter";
import { StudentRelationFilter } from "../inputs/StudentRelationFilter";
import { SubcourseListRelationFilter } from "../inputs/SubcourseListRelationFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class CourseWhereInput {
  @TypeGraphQL.Field(_type => [CourseWhereInput], {
    nullable: true
  })
  AND?: CourseWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [CourseWhereInput], {
    nullable: true
  })
  OR?: CourseWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [CourseWhereInput], {
    nullable: true
  })
  NOT?: CourseWhereInput[] | undefined;

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

  @TypeGraphQL.Field(_type => StudentRelationFilter, {
    nullable: true
  })
  student?: StudentRelationFilter | undefined;

  @TypeGraphQL.Field(_type => Course_guestListRelationFilter, {
    nullable: true
  })
  course_guest?: Course_guestListRelationFilter | undefined;

  @TypeGraphQL.Field(_type => Course_instructors_studentListRelationFilter, {
    nullable: true
  })
  course_instructors_student?: Course_instructors_studentListRelationFilter | undefined;

  @TypeGraphQL.Field(_type => Course_tags_course_tagListRelationFilter, {
    nullable: true
  })
  course_tags_course_tag?: Course_tags_course_tagListRelationFilter | undefined;

  @TypeGraphQL.Field(_type => SubcourseListRelationFilter, {
    nullable: true
  })
  subcourse?: SubcourseListRelationFilter | undefined;
}
