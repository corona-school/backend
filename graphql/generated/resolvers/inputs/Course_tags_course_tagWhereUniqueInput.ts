import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { course_tags_course_tagCourseIdCourseTagIdCompoundUniqueInput } from "../inputs/course_tags_course_tagCourseIdCourseTagIdCompoundUniqueInput";

@TypeGraphQL.InputType("Course_tags_course_tagWhereUniqueInput", {
  isAbstract: true
})
export class Course_tags_course_tagWhereUniqueInput {
  @TypeGraphQL.Field(_type => course_tags_course_tagCourseIdCourseTagIdCompoundUniqueInput, {
    nullable: true
  })
  courseId_courseTagId?: course_tags_course_tagCourseIdCourseTagIdCompoundUniqueInput | undefined;
}
