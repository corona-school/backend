import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilUpdateOneRequiredWithoutSubcourse_participants_pupilInput } from "../inputs/PupilUpdateOneRequiredWithoutSubcourse_participants_pupilInput";

@TypeGraphQL.InputType("Subcourse_participants_pupilUpdateWithoutSubcourseInput", {
  isAbstract: true
})
export class Subcourse_participants_pupilUpdateWithoutSubcourseInput {
  @TypeGraphQL.Field(_type => PupilUpdateOneRequiredWithoutSubcourse_participants_pupilInput, {
    nullable: true
  })
  pupil?: PupilUpdateOneRequiredWithoutSubcourse_participants_pupilInput | undefined;
}
