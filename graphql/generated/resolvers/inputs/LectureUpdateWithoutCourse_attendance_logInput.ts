import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { DateTimeFieldUpdateOperationsInput } from "../inputs/DateTimeFieldUpdateOperationsInput";
import { IntFieldUpdateOperationsInput } from "../inputs/IntFieldUpdateOperationsInput";
import { StudentUpdateOneWithoutLectureInput } from "../inputs/StudentUpdateOneWithoutLectureInput";
import { SubcourseUpdateOneWithoutLectureInput } from "../inputs/SubcourseUpdateOneWithoutLectureInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class LectureUpdateWithoutCourse_attendance_logInput {
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

  @TypeGraphQL.Field(_type => StudentUpdateOneWithoutLectureInput, {
    nullable: true
  })
  student?: StudentUpdateOneWithoutLectureInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseUpdateOneWithoutLectureInput, {
    nullable: true
  })
  subcourse?: SubcourseUpdateOneWithoutLectureInput | undefined;
}
