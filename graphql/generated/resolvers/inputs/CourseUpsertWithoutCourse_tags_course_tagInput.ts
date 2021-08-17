import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseCreateWithoutCourse_tags_course_tagInput } from "../inputs/CourseCreateWithoutCourse_tags_course_tagInput";
import { CourseUpdateWithoutCourse_tags_course_tagInput } from "../inputs/CourseUpdateWithoutCourse_tags_course_tagInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class CourseUpsertWithoutCourse_tags_course_tagInput {
  @TypeGraphQL.Field(_type => CourseUpdateWithoutCourse_tags_course_tagInput, {
    nullable: false
  })
  update!: CourseUpdateWithoutCourse_tags_course_tagInput;

  @TypeGraphQL.Field(_type => CourseCreateWithoutCourse_tags_course_tagInput, {
    nullable: false
  })
  create!: CourseCreateWithoutCourse_tags_course_tagInput;
}
