import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilUpdateOneRequiredWithoutSubcourse_waiting_list_pupilInput } from "../inputs/PupilUpdateOneRequiredWithoutSubcourse_waiting_list_pupilInput";

@TypeGraphQL.InputType("Subcourse_waiting_list_pupilUpdateWithoutSubcourseInput", {
  isAbstract: true
})
export class Subcourse_waiting_list_pupilUpdateWithoutSubcourseInput {
  @TypeGraphQL.Field(_type => PupilUpdateOneRequiredWithoutSubcourse_waiting_list_pupilInput, {
    nullable: true
  })
  pupil?: PupilUpdateOneRequiredWithoutSubcourse_waiting_list_pupilInput | undefined;
}
