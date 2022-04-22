import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseCreateWithoutSubcourseInput } from "../inputs/CourseCreateWithoutSubcourseInput";
import { CourseUpdateWithoutSubcourseInput } from "../inputs/CourseUpdateWithoutSubcourseInput";

@TypeGraphQL.InputType("CourseUpsertWithoutSubcourseInput", {
  isAbstract: true
})
export class CourseUpsertWithoutSubcourseInput {
  @TypeGraphQL.Field(_type => CourseUpdateWithoutSubcourseInput, {
    nullable: false
  })
  update!: CourseUpdateWithoutSubcourseInput;

  @TypeGraphQL.Field(_type => CourseCreateWithoutSubcourseInput, {
    nullable: false
  })
  create!: CourseCreateWithoutSubcourseInput;
}
