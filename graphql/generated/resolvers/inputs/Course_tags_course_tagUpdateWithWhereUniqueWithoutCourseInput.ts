import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_tags_course_tagUpdateWithoutCourseInput } from "../inputs/Course_tags_course_tagUpdateWithoutCourseInput";
import { Course_tags_course_tagWhereUniqueInput } from "../inputs/Course_tags_course_tagWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_tags_course_tagUpdateWithWhereUniqueWithoutCourseInput {
  @TypeGraphQL.Field(_type => Course_tags_course_tagWhereUniqueInput, {
    nullable: false
  })
  where!: Course_tags_course_tagWhereUniqueInput;

  @TypeGraphQL.Field(_type => Course_tags_course_tagUpdateWithoutCourseInput, {
    nullable: false
  })
  data!: Course_tags_course_tagUpdateWithoutCourseInput;
}
