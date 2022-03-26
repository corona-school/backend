import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { DateTimeFieldUpdateOperationsInput } from "../inputs/DateTimeFieldUpdateOperationsInput";
import { NullableIntFieldUpdateOperationsInput } from "../inputs/NullableIntFieldUpdateOperationsInput";
import { NullableStringFieldUpdateOperationsInput } from "../inputs/NullableStringFieldUpdateOperationsInput";
import { PupilUpdateOneWithoutCourse_attendance_logInput } from "../inputs/PupilUpdateOneWithoutCourse_attendance_logInput";

@TypeGraphQL.InputType("Course_attendance_logUpdateWithoutLectureInput", {
  isAbstract: true
})
export class Course_attendance_logUpdateWithoutLectureInput {
  @TypeGraphQL.Field(_type => DateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  createdAt?: DateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => DateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  updatedAt?: DateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableIntFieldUpdateOperationsInput, {
    nullable: true
  })
  attendedTime?: NullableIntFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableStringFieldUpdateOperationsInput, {
    nullable: true
  })
  ip?: NullableStringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => PupilUpdateOneWithoutCourse_attendance_logInput, {
    nullable: true
  })
  pupil?: PupilUpdateOneWithoutCourse_attendance_logInput | undefined;
}
