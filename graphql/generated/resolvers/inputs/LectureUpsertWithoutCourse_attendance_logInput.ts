import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { LectureCreateWithoutCourse_attendance_logInput } from "../inputs/LectureCreateWithoutCourse_attendance_logInput";
import { LectureUpdateWithoutCourse_attendance_logInput } from "../inputs/LectureUpdateWithoutCourse_attendance_logInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class LectureUpsertWithoutCourse_attendance_logInput {
  @TypeGraphQL.Field(_type => LectureUpdateWithoutCourse_attendance_logInput, {
    nullable: false
  })
  update!: LectureUpdateWithoutCourse_attendance_logInput;

  @TypeGraphQL.Field(_type => LectureCreateWithoutCourse_attendance_logInput, {
    nullable: false
  })
  create!: LectureCreateWithoutCourse_attendance_logInput;
}
