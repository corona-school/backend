import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_tags_course_tagCreateWithoutCourse_tagInput } from "../inputs/Course_tags_course_tagCreateWithoutCourse_tagInput";
import { Course_tags_course_tagUpdateWithoutCourse_tagInput } from "../inputs/Course_tags_course_tagUpdateWithoutCourse_tagInput";
import { Course_tags_course_tagWhereUniqueInput } from "../inputs/Course_tags_course_tagWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_tags_course_tagUpsertWithWhereUniqueWithoutCourse_tagInput {
  @TypeGraphQL.Field(_type => Course_tags_course_tagWhereUniqueInput, {
    nullable: false
  })
  where!: Course_tags_course_tagWhereUniqueInput;

  @TypeGraphQL.Field(_type => Course_tags_course_tagUpdateWithoutCourse_tagInput, {
    nullable: false
  })
  update!: Course_tags_course_tagUpdateWithoutCourse_tagInput;

  @TypeGraphQL.Field(_type => Course_tags_course_tagCreateWithoutCourse_tagInput, {
    nullable: false
  })
  create!: Course_tags_course_tagCreateWithoutCourse_tagInput;
}
