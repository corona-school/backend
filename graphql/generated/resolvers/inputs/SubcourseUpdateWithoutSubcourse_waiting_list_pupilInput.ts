import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BoolFieldUpdateOperationsInput } from "../inputs/BoolFieldUpdateOperationsInput";
import { CourseUpdateOneWithoutSubcourseInput } from "../inputs/CourseUpdateOneWithoutSubcourseInput";
import { Course_participation_certificateUpdateManyWithoutSubcourseInput } from "../inputs/Course_participation_certificateUpdateManyWithoutSubcourseInput";
import { DateTimeFieldUpdateOperationsInput } from "../inputs/DateTimeFieldUpdateOperationsInput";
import { IntFieldUpdateOperationsInput } from "../inputs/IntFieldUpdateOperationsInput";
import { LectureUpdateManyWithoutSubcourseInput } from "../inputs/LectureUpdateManyWithoutSubcourseInput";
import { Subcourse_instructors_studentUpdateManyWithoutSubcourseInput } from "../inputs/Subcourse_instructors_studentUpdateManyWithoutSubcourseInput";
import { Subcourse_participants_pupilUpdateManyWithoutSubcourseInput } from "../inputs/Subcourse_participants_pupilUpdateManyWithoutSubcourseInput";

@TypeGraphQL.InputType("SubcourseUpdateWithoutSubcourse_waiting_list_pupilInput", {
  isAbstract: true
})
export class SubcourseUpdateWithoutSubcourse_waiting_list_pupilInput {
  @TypeGraphQL.Field(_type => DateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  createdAt?: DateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => DateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  updatedAt?: DateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => IntFieldUpdateOperationsInput, {
    nullable: true
  })
  minGrade?: IntFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => IntFieldUpdateOperationsInput, {
    nullable: true
  })
  maxGrade?: IntFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => IntFieldUpdateOperationsInput, {
    nullable: true
  })
  maxParticipants?: IntFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => BoolFieldUpdateOperationsInput, {
    nullable: true
  })
  joinAfterStart?: BoolFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => BoolFieldUpdateOperationsInput, {
    nullable: true
  })
  published?: BoolFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => BoolFieldUpdateOperationsInput, {
    nullable: true
  })
  cancelled?: BoolFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => CourseUpdateOneWithoutSubcourseInput, {
    nullable: true
  })
  course?: CourseUpdateOneWithoutSubcourseInput | undefined;

  @TypeGraphQL.Field(_type => Course_participation_certificateUpdateManyWithoutSubcourseInput, {
    nullable: true
  })
  course_participation_certificate?: Course_participation_certificateUpdateManyWithoutSubcourseInput | undefined;

  @TypeGraphQL.Field(_type => LectureUpdateManyWithoutSubcourseInput, {
    nullable: true
  })
  lecture?: LectureUpdateManyWithoutSubcourseInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_instructors_studentUpdateManyWithoutSubcourseInput, {
    nullable: true
  })
  subcourse_instructors_student?: Subcourse_instructors_studentUpdateManyWithoutSubcourseInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_participants_pupilUpdateManyWithoutSubcourseInput, {
    nullable: true
  })
  subcourse_participants_pupil?: Subcourse_participants_pupilUpdateManyWithoutSubcourseInput | undefined;
}
