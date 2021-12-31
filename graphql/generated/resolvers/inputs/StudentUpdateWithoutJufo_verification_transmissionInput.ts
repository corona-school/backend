import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BoolFieldUpdateOperationsInput } from "../inputs/BoolFieldUpdateOperationsInput";
import { Certificate_of_conductUpdateOneWithoutStudentInput } from "../inputs/Certificate_of_conductUpdateOneWithoutStudentInput";
import { CourseUpdateManyWithoutStudentInput } from "../inputs/CourseUpdateManyWithoutStudentInput";
import { Course_guestUpdateManyWithoutStudentInput } from "../inputs/Course_guestUpdateManyWithoutStudentInput";
import { Course_instructors_studentUpdateManyWithoutStudentInput } from "../inputs/Course_instructors_studentUpdateManyWithoutStudentInput";
import { Course_participation_certificateUpdateManyWithoutStudentInput } from "../inputs/Course_participation_certificateUpdateManyWithoutStudentInput";
import { DateTimeFieldUpdateOperationsInput } from "../inputs/DateTimeFieldUpdateOperationsInput";
import { Enumstudent_registrationsource_enumFieldUpdateOperationsInput } from "../inputs/Enumstudent_registrationsource_enumFieldUpdateOperationsInput";
import { Expert_dataUpdateOneWithoutStudentInput } from "../inputs/Expert_dataUpdateOneWithoutStudentInput";
import { Instructor_screeningUpdateOneWithoutStudentInput } from "../inputs/Instructor_screeningUpdateOneWithoutStudentInput";
import { IntFieldUpdateOperationsInput } from "../inputs/IntFieldUpdateOperationsInput";
import { LectureUpdateManyWithoutStudentInput } from "../inputs/LectureUpdateManyWithoutStudentInput";
import { MatchUpdateManyWithoutStudentInput } from "../inputs/MatchUpdateManyWithoutStudentInput";
import { NullableBoolFieldUpdateOperationsInput } from "../inputs/NullableBoolFieldUpdateOperationsInput";
import { NullableDateTimeFieldUpdateOperationsInput } from "../inputs/NullableDateTimeFieldUpdateOperationsInput";
import { NullableEnumstudent_module_enumFieldUpdateOperationsInput } from "../inputs/NullableEnumstudent_module_enumFieldUpdateOperationsInput";
import { NullableEnumstudent_state_enumFieldUpdateOperationsInput } from "../inputs/NullableEnumstudent_state_enumFieldUpdateOperationsInput";
import { NullableIntFieldUpdateOperationsInput } from "../inputs/NullableIntFieldUpdateOperationsInput";
import { NullableStringFieldUpdateOperationsInput } from "../inputs/NullableStringFieldUpdateOperationsInput";
import { Participation_certificateUpdateManyWithoutStudentInput } from "../inputs/Participation_certificateUpdateManyWithoutStudentInput";
import { Project_coaching_screeningUpdateOneWithoutStudentInput } from "../inputs/Project_coaching_screeningUpdateOneWithoutStudentInput";
import { Project_field_with_grade_restrictionUpdateManyWithoutStudentInput } from "../inputs/Project_field_with_grade_restrictionUpdateManyWithoutStudentInput";
import { Project_matchUpdateManyWithoutStudentInput } from "../inputs/Project_matchUpdateManyWithoutStudentInput";
import { ScreeningUpdateOneWithoutStudentInput } from "../inputs/ScreeningUpdateOneWithoutStudentInput";
import { StringFieldUpdateOperationsInput } from "../inputs/StringFieldUpdateOperationsInput";
import { StudentUpdatelanguagesInput } from "../inputs/StudentUpdatelanguagesInput";
import { Subcourse_instructors_studentUpdateManyWithoutStudentInput } from "../inputs/Subcourse_instructors_studentUpdateManyWithoutStudentInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class StudentUpdateWithoutJufo_verification_transmissionInput {
  @TypeGraphQL.Field(_type => DateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  createdAt?: DateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => DateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  updatedAt?: DateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableStringFieldUpdateOperationsInput, {
    nullable: true
  })
  firstname?: NullableStringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableStringFieldUpdateOperationsInput, {
    nullable: true
  })
  lastname?: NullableStringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => BoolFieldUpdateOperationsInput, {
    nullable: true
  })
  active?: BoolFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => StringFieldUpdateOperationsInput, {
    nullable: true
  })
  email?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableStringFieldUpdateOperationsInput, {
    nullable: true
  })
  verification?: NullableStringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableDateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  verifiedAt?: NullableDateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableStringFieldUpdateOperationsInput, {
    nullable: true
  })
  authToken?: NullableStringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => BoolFieldUpdateOperationsInput, {
    nullable: true
  })
  authTokenUsed?: BoolFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableDateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  authTokenSent?: NullableDateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => StringFieldUpdateOperationsInput, {
    nullable: true
  })
  wix_id?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => DateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  wix_creation_date?: DateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableStringFieldUpdateOperationsInput, {
    nullable: true
  })
  phone?: NullableStringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableStringFieldUpdateOperationsInput, {
    nullable: true
  })
  feedback?: NullableStringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => BoolFieldUpdateOperationsInput, {
    nullable: true
  })
  newsletter?: BoolFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => BoolFieldUpdateOperationsInput, {
    nullable: true
  })
  isStudent?: BoolFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableStringFieldUpdateOperationsInput, {
    nullable: true
  })
  subjects?: NullableStringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => IntFieldUpdateOperationsInput, {
    nullable: true
  })
  openMatchRequestCount?: IntFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => BoolFieldUpdateOperationsInput, {
    nullable: true
  })
  isInstructor?: BoolFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableStringFieldUpdateOperationsInput, {
    nullable: true
  })
  msg?: NullableStringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableEnumstudent_state_enumFieldUpdateOperationsInput, {
    nullable: true
  })
  state?: NullableEnumstudent_state_enumFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableStringFieldUpdateOperationsInput, {
    nullable: true
  })
  university?: NullableStringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableEnumstudent_module_enumFieldUpdateOperationsInput, {
    nullable: true
  })
  module?: NullableEnumstudent_module_enumFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableIntFieldUpdateOperationsInput, {
    nullable: true
  })
  moduleHours?: NullableIntFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => BoolFieldUpdateOperationsInput, {
    nullable: true
  })
  isProjectCoach?: BoolFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableStringFieldUpdateOperationsInput, {
    nullable: true
  })
  wasJufoParticipant?: NullableStringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableBoolFieldUpdateOperationsInput, {
    nullable: true
  })
  hasJufoCertificate?: NullableBoolFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableStringFieldUpdateOperationsInput, {
    nullable: true
  })
  jufoPastParticipationInfo?: NullableStringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableBoolFieldUpdateOperationsInput, {
    nullable: true
  })
  jufoPastParticipationConfirmed?: NullableBoolFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableBoolFieldUpdateOperationsInput, {
    nullable: true
  })
  isUniversityStudent?: NullableBoolFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => IntFieldUpdateOperationsInput, {
    nullable: true
  })
  openProjectMatchRequestCount?: IntFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => IntFieldUpdateOperationsInput, {
    nullable: true
  })
  sentJufoAlumniScreeningReminderCount?: IntFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableDateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  lastSentJufoAlumniScreeningInvitationDate?: NullableDateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableBoolFieldUpdateOperationsInput, {
    nullable: true
  })
  supportsInDaZ?: NullableBoolFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => IntFieldUpdateOperationsInput, {
    nullable: true
  })
  sentScreeningReminderCount?: IntFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableDateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  lastSentScreeningInvitationDate?: NullableDateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => IntFieldUpdateOperationsInput, {
    nullable: true
  })
  sentInstructorScreeningReminderCount?: IntFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableDateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  lastSentInstructorScreeningInvitationDate?: NullableDateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableDateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  lastUpdatedSettingsViaBlocker?: NullableDateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => Enumstudent_registrationsource_enumFieldUpdateOperationsInput, {
    nullable: true
  })
  registrationSource?: Enumstudent_registrationsource_enumFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => StudentUpdatelanguagesInput, {
    nullable: true
  })
  languages?: StudentUpdatelanguagesInput | undefined;

  @TypeGraphQL.Field(_type => Certificate_of_conductUpdateOneWithoutStudentInput, {
    nullable: true
  })
  certificate_of_conduct?: Certificate_of_conductUpdateOneWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => CourseUpdateManyWithoutStudentInput, {
    nullable: true
  })
  course?: CourseUpdateManyWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Course_guestUpdateManyWithoutStudentInput, {
    nullable: true
  })
  course_guest?: Course_guestUpdateManyWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Course_instructors_studentUpdateManyWithoutStudentInput, {
    nullable: true
  })
  course_instructors_student?: Course_instructors_studentUpdateManyWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Course_participation_certificateUpdateManyWithoutStudentInput, {
    nullable: true
  })
  course_participation_certificate?: Course_participation_certificateUpdateManyWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Expert_dataUpdateOneWithoutStudentInput, {
    nullable: true
  })
  expert_data?: Expert_dataUpdateOneWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Instructor_screeningUpdateOneWithoutStudentInput, {
    nullable: true
  })
  instructor_screening?: Instructor_screeningUpdateOneWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => LectureUpdateManyWithoutStudentInput, {
    nullable: true
  })
  lecture?: LectureUpdateManyWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => MatchUpdateManyWithoutStudentInput, {
    nullable: true
  })
  match?: MatchUpdateManyWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Participation_certificateUpdateManyWithoutStudentInput, {
    nullable: true
  })
  participation_certificate?: Participation_certificateUpdateManyWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Project_coaching_screeningUpdateOneWithoutStudentInput, {
    nullable: true
  })
  project_coaching_screening?: Project_coaching_screeningUpdateOneWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Project_field_with_grade_restrictionUpdateManyWithoutStudentInput, {
    nullable: true
  })
  project_field_with_grade_restriction?: Project_field_with_grade_restrictionUpdateManyWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Project_matchUpdateManyWithoutStudentInput, {
    nullable: true
  })
  project_match?: Project_matchUpdateManyWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => ScreeningUpdateOneWithoutStudentInput, {
    nullable: true
  })
  screening?: ScreeningUpdateOneWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_instructors_studentUpdateManyWithoutStudentInput, {
    nullable: true
  })
  subcourse_instructors_student?: Subcourse_instructors_studentUpdateManyWithoutStudentInput | undefined;
}
