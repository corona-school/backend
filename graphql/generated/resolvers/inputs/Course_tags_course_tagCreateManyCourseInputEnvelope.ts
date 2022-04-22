import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_tags_course_tagCreateManyCourseInput } from "../inputs/Course_tags_course_tagCreateManyCourseInput";

@TypeGraphQL.InputType("Course_tags_course_tagCreateManyCourseInputEnvelope", {
  isAbstract: true
})
export class Course_tags_course_tagCreateManyCourseInputEnvelope {
  @TypeGraphQL.Field(_type => [Course_tags_course_tagCreateManyCourseInput], {
    nullable: false
  })
  data!: Course_tags_course_tagCreateManyCourseInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
