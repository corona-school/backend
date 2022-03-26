import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_tagCreateNestedOneWithoutCourse_tags_course_tagInput } from "../inputs/Course_tagCreateNestedOneWithoutCourse_tags_course_tagInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_tags_course_tagCreateWithoutCourseInput {
  @TypeGraphQL.Field(_type => Course_tagCreateNestedOneWithoutCourse_tags_course_tagInput, {
    nullable: false
  })
  course_tag!: Course_tagCreateNestedOneWithoutCourse_tags_course_tagInput;
}
