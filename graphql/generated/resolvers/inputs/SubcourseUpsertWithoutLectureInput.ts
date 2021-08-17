import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SubcourseCreateWithoutLectureInput } from "../inputs/SubcourseCreateWithoutLectureInput";
import { SubcourseUpdateWithoutLectureInput } from "../inputs/SubcourseUpdateWithoutLectureInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class SubcourseUpsertWithoutLectureInput {
  @TypeGraphQL.Field(_type => SubcourseUpdateWithoutLectureInput, {
    nullable: false
  })
  update!: SubcourseUpdateWithoutLectureInput;

  @TypeGraphQL.Field(_type => SubcourseCreateWithoutLectureInput, {
    nullable: false
  })
  create!: SubcourseCreateWithoutLectureInput;
}
