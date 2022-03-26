import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";

@TypeGraphQL.InputType("Course_tagCreateWithoutCourse_tags_course_tagInput", {
  isAbstract: true
})
export class Course_tagCreateWithoutCourse_tags_course_tagInput {
  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  identifier!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  name!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  category!: string;
}
