import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_tagCreateWithoutCourse_tags_course_tagInput } from "../inputs/Course_tagCreateWithoutCourse_tags_course_tagInput";
import { Course_tagUpdateWithoutCourse_tags_course_tagInput } from "../inputs/Course_tagUpdateWithoutCourse_tags_course_tagInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_tagUpsertWithoutCourse_tags_course_tagInput {
  @TypeGraphQL.Field(_type => Course_tagUpdateWithoutCourse_tags_course_tagInput, {
    nullable: false
  })
  update!: Course_tagUpdateWithoutCourse_tags_course_tagInput;

  @TypeGraphQL.Field(_type => Course_tagCreateWithoutCourse_tags_course_tagInput, {
    nullable: false
  })
  create!: Course_tagCreateWithoutCourse_tags_course_tagInput;
}
