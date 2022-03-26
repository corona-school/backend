import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseCreateNestedOneWithoutCourse_tags_course_tagInput } from "../inputs/CourseCreateNestedOneWithoutCourse_tags_course_tagInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_tags_course_tagCreateWithoutCourse_tagInput {
  @TypeGraphQL.Field(_type => CourseCreateNestedOneWithoutCourse_tags_course_tagInput, {
    nullable: false
  })
  course!: CourseCreateNestedOneWithoutCourse_tags_course_tagInput;
}
