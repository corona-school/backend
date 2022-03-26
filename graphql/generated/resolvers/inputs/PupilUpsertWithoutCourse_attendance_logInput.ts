import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateWithoutCourse_attendance_logInput } from "../inputs/PupilCreateWithoutCourse_attendance_logInput";
import { PupilUpdateWithoutCourse_attendance_logInput } from "../inputs/PupilUpdateWithoutCourse_attendance_logInput";

@TypeGraphQL.InputType("PupilUpsertWithoutCourse_attendance_logInput", {
  isAbstract: true
})
export class PupilUpsertWithoutCourse_attendance_logInput {
  @TypeGraphQL.Field(_type => PupilUpdateWithoutCourse_attendance_logInput, {
    nullable: false
  })
  update!: PupilUpdateWithoutCourse_attendance_logInput;

  @TypeGraphQL.Field(_type => PupilCreateWithoutCourse_attendance_logInput, {
    nullable: false
  })
  create!: PupilCreateWithoutCourse_attendance_logInput;
}
