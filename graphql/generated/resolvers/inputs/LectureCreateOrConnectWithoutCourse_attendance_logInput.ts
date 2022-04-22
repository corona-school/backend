import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { LectureCreateWithoutCourse_attendance_logInput } from "../inputs/LectureCreateWithoutCourse_attendance_logInput";
import { LectureWhereUniqueInput } from "../inputs/LectureWhereUniqueInput";

@TypeGraphQL.InputType("LectureCreateOrConnectWithoutCourse_attendance_logInput", {
  isAbstract: true
})
export class LectureCreateOrConnectWithoutCourse_attendance_logInput {
  @TypeGraphQL.Field(_type => LectureWhereUniqueInput, {
    nullable: false
  })
  where!: LectureWhereUniqueInput;

  @TypeGraphQL.Field(_type => LectureCreateWithoutCourse_attendance_logInput, {
    nullable: false
  })
  create!: LectureCreateWithoutCourse_attendance_logInput;
}
