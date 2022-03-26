import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseCreateWithoutCourse_guestInput } from "../inputs/CourseCreateWithoutCourse_guestInput";
import { CourseUpdateWithoutCourse_guestInput } from "../inputs/CourseUpdateWithoutCourse_guestInput";

@TypeGraphQL.InputType("CourseUpsertWithoutCourse_guestInput", {
  isAbstract: true
})
export class CourseUpsertWithoutCourse_guestInput {
  @TypeGraphQL.Field(_type => CourseUpdateWithoutCourse_guestInput, {
    nullable: false
  })
  update!: CourseUpdateWithoutCourse_guestInput;

  @TypeGraphQL.Field(_type => CourseCreateWithoutCourse_guestInput, {
    nullable: false
  })
  create!: CourseCreateWithoutCourse_guestInput;
}
