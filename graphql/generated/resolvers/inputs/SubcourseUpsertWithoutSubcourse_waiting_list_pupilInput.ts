import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SubcourseCreateWithoutSubcourse_waiting_list_pupilInput } from "../inputs/SubcourseCreateWithoutSubcourse_waiting_list_pupilInput";
import { SubcourseUpdateWithoutSubcourse_waiting_list_pupilInput } from "../inputs/SubcourseUpdateWithoutSubcourse_waiting_list_pupilInput";

@TypeGraphQL.InputType("SubcourseUpsertWithoutSubcourse_waiting_list_pupilInput", {
  isAbstract: true
})
export class SubcourseUpsertWithoutSubcourse_waiting_list_pupilInput {
  @TypeGraphQL.Field(_type => SubcourseUpdateWithoutSubcourse_waiting_list_pupilInput, {
    nullable: false
  })
  update!: SubcourseUpdateWithoutSubcourse_waiting_list_pupilInput;

  @TypeGraphQL.Field(_type => SubcourseCreateWithoutSubcourse_waiting_list_pupilInput, {
    nullable: false
  })
  create!: SubcourseCreateWithoutSubcourse_waiting_list_pupilInput;
}
