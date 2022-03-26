import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseCreateWithoutCourse_instructors_studentInput } from "../inputs/CourseCreateWithoutCourse_instructors_studentInput";
import { CourseUpdateWithoutCourse_instructors_studentInput } from "../inputs/CourseUpdateWithoutCourse_instructors_studentInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class CourseUpsertWithoutCourse_instructors_studentInput {
  @TypeGraphQL.Field(_type => CourseUpdateWithoutCourse_instructors_studentInput, {
    nullable: false
  })
  update!: CourseUpdateWithoutCourse_instructors_studentInput;

  @TypeGraphQL.Field(_type => CourseCreateWithoutCourse_instructors_studentInput, {
    nullable: false
  })
  create!: CourseCreateWithoutCourse_instructors_studentInput;
}
