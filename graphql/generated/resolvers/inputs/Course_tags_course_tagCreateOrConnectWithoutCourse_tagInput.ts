import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_tags_course_tagCreateWithoutCourse_tagInput } from "../inputs/Course_tags_course_tagCreateWithoutCourse_tagInput";
import { Course_tags_course_tagWhereUniqueInput } from "../inputs/Course_tags_course_tagWhereUniqueInput";

@TypeGraphQL.InputType("Course_tags_course_tagCreateOrConnectWithoutCourse_tagInput", {
  isAbstract: true
})
export class Course_tags_course_tagCreateOrConnectWithoutCourse_tagInput {
  @TypeGraphQL.Field(_type => Course_tags_course_tagWhereUniqueInput, {
    nullable: false
  })
  where!: Course_tags_course_tagWhereUniqueInput;

  @TypeGraphQL.Field(_type => Course_tags_course_tagCreateWithoutCourse_tagInput, {
    nullable: false
  })
  create!: Course_tags_course_tagCreateWithoutCourse_tagInput;
}
