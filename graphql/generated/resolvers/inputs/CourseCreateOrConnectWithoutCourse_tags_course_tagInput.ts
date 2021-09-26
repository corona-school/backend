import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseCreateWithoutCourse_tags_course_tagInput } from "../inputs/CourseCreateWithoutCourse_tags_course_tagInput";
import { CourseWhereUniqueInput } from "../inputs/CourseWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class CourseCreateOrConnectWithoutCourse_tags_course_tagInput {
  @TypeGraphQL.Field(_type => CourseWhereUniqueInput, {
    nullable: false
  })
  where!: CourseWhereUniqueInput;

  @TypeGraphQL.Field(_type => CourseCreateWithoutCourse_tags_course_tagInput, {
    nullable: false
  })
  create!: CourseCreateWithoutCourse_tags_course_tagInput;
}
