import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SubcourseCreateWithoutCourse_participation_certificateInput } from "../inputs/SubcourseCreateWithoutCourse_participation_certificateInput";
import { SubcourseUpdateWithoutCourse_participation_certificateInput } from "../inputs/SubcourseUpdateWithoutCourse_participation_certificateInput";

@TypeGraphQL.InputType("SubcourseUpsertWithoutCourse_participation_certificateInput", {
  isAbstract: true
})
export class SubcourseUpsertWithoutCourse_participation_certificateInput {
  @TypeGraphQL.Field(_type => SubcourseUpdateWithoutCourse_participation_certificateInput, {
    nullable: false
  })
  update!: SubcourseUpdateWithoutCourse_participation_certificateInput;

  @TypeGraphQL.Field(_type => SubcourseCreateWithoutCourse_participation_certificateInput, {
    nullable: false
  })
  create!: SubcourseCreateWithoutCourse_participation_certificateInput;
}
