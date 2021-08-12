import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { LectureCreateNestedOneWithoutCourse_attendance_logInput } from "../inputs/LectureCreateNestedOneWithoutCourse_attendance_logInput";
import { PupilCreateNestedOneWithoutCourse_attendance_logInput } from "../inputs/PupilCreateNestedOneWithoutCourse_attendance_logInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_attendance_logCreateInput {
  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  createdAt?: Date | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  updatedAt?: Date | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  attendedTime?: number | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  ip?: string | undefined;

  @TypeGraphQL.Field(_type => LectureCreateNestedOneWithoutCourse_attendance_logInput, {
    nullable: true
  })
  lecture?: LectureCreateNestedOneWithoutCourse_attendance_logInput | undefined;

  @TypeGraphQL.Field(_type => PupilCreateNestedOneWithoutCourse_attendance_logInput, {
    nullable: true
  })
  pupil?: PupilCreateNestedOneWithoutCourse_attendance_logInput | undefined;
}
