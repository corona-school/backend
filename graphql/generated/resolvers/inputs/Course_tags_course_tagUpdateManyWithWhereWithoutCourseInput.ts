import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_tags_course_tagScalarWhereInput } from "../inputs/Course_tags_course_tagScalarWhereInput";
import { Course_tags_course_tagUpdateManyMutationInput } from "../inputs/Course_tags_course_tagUpdateManyMutationInput";

@TypeGraphQL.InputType("Course_tags_course_tagUpdateManyWithWhereWithoutCourseInput", {
  isAbstract: true
})
export class Course_tags_course_tagUpdateManyWithWhereWithoutCourseInput {
  @TypeGraphQL.Field(_type => Course_tags_course_tagScalarWhereInput, {
    nullable: false
  })
  where!: Course_tags_course_tagScalarWhereInput;

  @TypeGraphQL.Field(_type => Course_tags_course_tagUpdateManyMutationInput, {
    nullable: false
  })
  data!: Course_tags_course_tagUpdateManyMutationInput;
}
