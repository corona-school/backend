import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_attendance_logUpdateManyWithoutLectureInput } from "../inputs/Course_attendance_logUpdateManyWithoutLectureInput";
import { DateTimeFieldUpdateOperationsInput } from "../inputs/DateTimeFieldUpdateOperationsInput";
import { IntFieldUpdateOperationsInput } from "../inputs/IntFieldUpdateOperationsInput";
import { SubcourseUpdateOneWithoutLectureInput } from "../inputs/SubcourseUpdateOneWithoutLectureInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class LectureUpdateWithoutStudentInput {
  @TypeGraphQL.Field(_type => DateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  createdAt?: DateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => DateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  updatedAt?: DateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => DateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  start?: DateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => IntFieldUpdateOperationsInput, {
    nullable: true
  })
  duration?: IntFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseUpdateOneWithoutLectureInput, {
    nullable: true
  })
  subcourse?: SubcourseUpdateOneWithoutLectureInput | undefined;

  @TypeGraphQL.Field(_type => Course_attendance_logUpdateManyWithoutLectureInput, {
    nullable: true
  })
  course_attendance_log?: Course_attendance_logUpdateManyWithoutLectureInput | undefined;
}
