import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateWithoutSubcourse_waiting_list_pupilInput } from "../inputs/PupilCreateWithoutSubcourse_waiting_list_pupilInput";
import { PupilUpdateWithoutSubcourse_waiting_list_pupilInput } from "../inputs/PupilUpdateWithoutSubcourse_waiting_list_pupilInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class PupilUpsertWithoutSubcourse_waiting_list_pupilInput {
  @TypeGraphQL.Field(_type => PupilUpdateWithoutSubcourse_waiting_list_pupilInput, {
    nullable: false
  })
  update!: PupilUpdateWithoutSubcourse_waiting_list_pupilInput;

  @TypeGraphQL.Field(_type => PupilCreateWithoutSubcourse_waiting_list_pupilInput, {
    nullable: false
  })
  create!: PupilCreateWithoutSubcourse_waiting_list_pupilInput;
}
