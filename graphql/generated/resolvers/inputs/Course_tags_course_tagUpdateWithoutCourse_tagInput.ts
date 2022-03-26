import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseUpdateOneRequiredWithoutCourse_tags_course_tagInput } from "../inputs/CourseUpdateOneRequiredWithoutCourse_tags_course_tagInput";

@TypeGraphQL.InputType("Course_tags_course_tagUpdateWithoutCourse_tagInput", {
  isAbstract: true
})
export class Course_tags_course_tagUpdateWithoutCourse_tagInput {
  @TypeGraphQL.Field(_type => CourseUpdateOneRequiredWithoutCourse_tags_course_tagInput, {
    nullable: true
  })
  course?: CourseUpdateOneRequiredWithoutCourse_tags_course_tagInput | undefined;
}
