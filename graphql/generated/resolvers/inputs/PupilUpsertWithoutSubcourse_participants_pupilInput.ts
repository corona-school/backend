import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateWithoutSubcourse_participants_pupilInput } from "../inputs/PupilCreateWithoutSubcourse_participants_pupilInput";
import { PupilUpdateWithoutSubcourse_participants_pupilInput } from "../inputs/PupilUpdateWithoutSubcourse_participants_pupilInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class PupilUpsertWithoutSubcourse_participants_pupilInput {
  @TypeGraphQL.Field(_type => PupilUpdateWithoutSubcourse_participants_pupilInput, {
    nullable: false
  })
  update!: PupilUpdateWithoutSubcourse_participants_pupilInput;

  @TypeGraphQL.Field(_type => PupilCreateWithoutSubcourse_participants_pupilInput, {
    nullable: false
  })
  create!: PupilCreateWithoutSubcourse_participants_pupilInput;
}
