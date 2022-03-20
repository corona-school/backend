import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateNestedOneWithoutSubcourse_participants_pupilInput } from "../inputs/PupilCreateNestedOneWithoutSubcourse_participants_pupilInput";
import { SubcourseCreateNestedOneWithoutSubcourse_participants_pupilInput } from "../inputs/SubcourseCreateNestedOneWithoutSubcourse_participants_pupilInput";

@TypeGraphQL.InputType("Subcourse_participants_pupilCreateInput", {
  isAbstract: true
})
export class Subcourse_participants_pupilCreateInput {
  @TypeGraphQL.Field(_type => PupilCreateNestedOneWithoutSubcourse_participants_pupilInput, {
    nullable: false
  })
  pupil!: PupilCreateNestedOneWithoutSubcourse_participants_pupilInput;

  @TypeGraphQL.Field(_type => SubcourseCreateNestedOneWithoutSubcourse_participants_pupilInput, {
    nullable: false
  })
  subcourse!: SubcourseCreateNestedOneWithoutSubcourse_participants_pupilInput;
}
