import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_tags_course_tagCreateNestedManyWithoutCourse_tagInput } from "../inputs/Course_tags_course_tagCreateNestedManyWithoutCourse_tagInput";

@TypeGraphQL.InputType("Course_tagCreateInput", {
  isAbstract: true
})
export class Course_tagCreateInput {
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

  @TypeGraphQL.Field(_type => Course_tags_course_tagCreateNestedManyWithoutCourse_tagInput, {
    nullable: true
  })
  course_tags_course_tag?: Course_tags_course_tagCreateNestedManyWithoutCourse_tagInput | undefined;
}
