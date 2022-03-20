import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateNestedOneWithoutSubcourse_waiting_list_pupilInput } from "../inputs/PupilCreateNestedOneWithoutSubcourse_waiting_list_pupilInput";

@TypeGraphQL.InputType("Subcourse_waiting_list_pupilCreateWithoutSubcourseInput", {
  isAbstract: true
})
export class Subcourse_waiting_list_pupilCreateWithoutSubcourseInput {
  @TypeGraphQL.Field(_type => PupilCreateNestedOneWithoutSubcourse_waiting_list_pupilInput, {
    nullable: false
  })
  pupil!: PupilCreateNestedOneWithoutSubcourse_waiting_list_pupilInput;
}
