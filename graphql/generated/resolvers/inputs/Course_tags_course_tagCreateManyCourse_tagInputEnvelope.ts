import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_tags_course_tagCreateManyCourse_tagInput } from "../inputs/Course_tags_course_tagCreateManyCourse_tagInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_tags_course_tagCreateManyCourse_tagInputEnvelope {
  @TypeGraphQL.Field(_type => [Course_tags_course_tagCreateManyCourse_tagInput], {
    nullable: false
  })
  data!: Course_tags_course_tagCreateManyCourse_tagInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
