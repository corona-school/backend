import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_tagUpdateOneRequiredWithoutCourse_tags_course_tagInput } from "../inputs/Course_tagUpdateOneRequiredWithoutCourse_tags_course_tagInput";

@TypeGraphQL.InputType("Course_tags_course_tagUpdateWithoutCourseInput", {
  isAbstract: true
})
export class Course_tags_course_tagUpdateWithoutCourseInput {
  @TypeGraphQL.Field(_type => Course_tagUpdateOneRequiredWithoutCourse_tags_course_tagInput, {
    nullable: true
  })
  course_tag?: Course_tagUpdateOneRequiredWithoutCourse_tags_course_tagInput | undefined;
}
