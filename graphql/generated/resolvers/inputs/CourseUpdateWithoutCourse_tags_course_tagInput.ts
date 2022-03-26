import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BoolFieldUpdateOperationsInput } from "../inputs/BoolFieldUpdateOperationsInput";
import { Course_guestUpdateManyWithoutCourseInput } from "../inputs/Course_guestUpdateManyWithoutCourseInput";
import { Course_instructors_studentUpdateManyWithoutCourseInput } from "../inputs/Course_instructors_studentUpdateManyWithoutCourseInput";
import { DateTimeFieldUpdateOperationsInput } from "../inputs/DateTimeFieldUpdateOperationsInput";
import { Enumcourse_category_enumFieldUpdateOperationsInput } from "../inputs/Enumcourse_category_enumFieldUpdateOperationsInput";
import { Enumcourse_coursestate_enumFieldUpdateOperationsInput } from "../inputs/Enumcourse_coursestate_enumFieldUpdateOperationsInput";
import { IntFieldUpdateOperationsInput } from "../inputs/IntFieldUpdateOperationsInput";
import { NullableStringFieldUpdateOperationsInput } from "../inputs/NullableStringFieldUpdateOperationsInput";
import { StringFieldUpdateOperationsInput } from "../inputs/StringFieldUpdateOperationsInput";
import { StudentUpdateOneWithoutCourseInput } from "../inputs/StudentUpdateOneWithoutCourseInput";
import { SubcourseUpdateManyWithoutCourseInput } from "../inputs/SubcourseUpdateManyWithoutCourseInput";

@TypeGraphQL.InputType("CourseUpdateWithoutCourse_tags_course_tagInput", {
  isAbstract: true
})
export class CourseUpdateWithoutCourse_tags_course_tagInput {
  @TypeGraphQL.Field(_type => DateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  createdAt?: DateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => DateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  updatedAt?: DateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => StringFieldUpdateOperationsInput, {
    nullable: true
  })
  name?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => StringFieldUpdateOperationsInput, {
    nullable: true
  })
  outline?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => StringFieldUpdateOperationsInput, {
    nullable: true
  })
  description?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableStringFieldUpdateOperationsInput, {
    nullable: true
  })
  imageKey?: NullableStringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => Enumcourse_category_enumFieldUpdateOperationsInput, {
    nullable: true
  })
  category?: Enumcourse_category_enumFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => Enumcourse_coursestate_enumFieldUpdateOperationsInput, {
    nullable: true
  })
  courseState?: Enumcourse_coursestate_enumFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableStringFieldUpdateOperationsInput, {
    nullable: true
  })
  screeningComment?: NullableStringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => IntFieldUpdateOperationsInput, {
    nullable: true
  })
  publicRanking?: IntFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => BoolFieldUpdateOperationsInput, {
    nullable: true
  })
  allowContact?: BoolFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => StudentUpdateOneWithoutCourseInput, {
    nullable: true
  })
  student?: StudentUpdateOneWithoutCourseInput | undefined;

  @TypeGraphQL.Field(_type => Course_guestUpdateManyWithoutCourseInput, {
    nullable: true
  })
  course_guest?: Course_guestUpdateManyWithoutCourseInput | undefined;

  @TypeGraphQL.Field(_type => Course_instructors_studentUpdateManyWithoutCourseInput, {
    nullable: true
  })
  course_instructors_student?: Course_instructors_studentUpdateManyWithoutCourseInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseUpdateManyWithoutCourseInput, {
    nullable: true
  })
  subcourse?: SubcourseUpdateManyWithoutCourseInput | undefined;
}
