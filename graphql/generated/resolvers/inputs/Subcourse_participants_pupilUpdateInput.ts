import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilUpdateOneRequiredWithoutSubcourse_participants_pupilInput } from "../inputs/PupilUpdateOneRequiredWithoutSubcourse_participants_pupilInput";
import { SubcourseUpdateOneRequiredWithoutSubcourse_participants_pupilInput } from "../inputs/SubcourseUpdateOneRequiredWithoutSubcourse_participants_pupilInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Subcourse_participants_pupilUpdateInput {
  @TypeGraphQL.Field(_type => PupilUpdateOneRequiredWithoutSubcourse_participants_pupilInput, {
    nullable: true
  })
  pupil?: PupilUpdateOneRequiredWithoutSubcourse_participants_pupilInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseUpdateOneRequiredWithoutSubcourse_participants_pupilInput, {
    nullable: true
  })
  subcourse?: SubcourseUpdateOneRequiredWithoutSubcourse_participants_pupilInput | undefined;
}
