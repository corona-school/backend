import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateNestedOneWithoutSubcourse_participants_pupilInput } from "../inputs/PupilCreateNestedOneWithoutSubcourse_participants_pupilInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Subcourse_participants_pupilCreateWithoutSubcourseInput {
  @TypeGraphQL.Field(_type => PupilCreateNestedOneWithoutSubcourse_participants_pupilInput, {
    nullable: false
  })
  pupil!: PupilCreateNestedOneWithoutSubcourse_participants_pupilInput;
}
