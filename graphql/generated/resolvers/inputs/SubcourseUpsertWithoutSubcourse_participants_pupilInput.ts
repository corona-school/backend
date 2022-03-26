import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SubcourseCreateWithoutSubcourse_participants_pupilInput } from "../inputs/SubcourseCreateWithoutSubcourse_participants_pupilInput";
import { SubcourseUpdateWithoutSubcourse_participants_pupilInput } from "../inputs/SubcourseUpdateWithoutSubcourse_participants_pupilInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class SubcourseUpsertWithoutSubcourse_participants_pupilInput {
  @TypeGraphQL.Field(_type => SubcourseUpdateWithoutSubcourse_participants_pupilInput, {
    nullable: false
  })
  update!: SubcourseUpdateWithoutSubcourse_participants_pupilInput;

  @TypeGraphQL.Field(_type => SubcourseCreateWithoutSubcourse_participants_pupilInput, {
    nullable: false
  })
  create!: SubcourseCreateWithoutSubcourse_participants_pupilInput;
}
