import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BoolFieldUpdateOperationsInput } from "../inputs/BoolFieldUpdateOperationsInput";
import { Course_attendance_logUpdateManyWithoutPupilInput } from "../inputs/Course_attendance_logUpdateManyWithoutPupilInput";
import { DateTimeFieldUpdateOperationsInput } from "../inputs/DateTimeFieldUpdateOperationsInput";
import { Enumpupil_registrationsource_enumFieldUpdateOperationsInput } from "../inputs/Enumpupil_registrationsource_enumFieldUpdateOperationsInput";
import { Enumpupil_schooltype_enumFieldUpdateOperationsInput } from "../inputs/Enumpupil_schooltype_enumFieldUpdateOperationsInput";
import { Enumpupil_state_enumFieldUpdateOperationsInput } from "../inputs/Enumpupil_state_enumFieldUpdateOperationsInput";
import { IntFieldUpdateOperationsInput } from "../inputs/IntFieldUpdateOperationsInput";
import { MatchUpdateManyWithoutPupilInput } from "../inputs/MatchUpdateManyWithoutPupilInput";
import { NullableDateTimeFieldUpdateOperationsInput } from "../inputs/NullableDateTimeFieldUpdateOperationsInput";
import { NullableEnumpupil_learninggermansince_enumFieldUpdateOperationsInput } from "../inputs/NullableEnumpupil_learninggermansince_enumFieldUpdateOperationsInput";
import { NullableStringFieldUpdateOperationsInput } from "../inputs/NullableStringFieldUpdateOperationsInput";
import { Participation_certificateUpdateManyWithoutPupilInput } from "../inputs/Participation_certificateUpdateManyWithoutPupilInput";
import { Project_matchUpdateManyWithoutPupilInput } from "../inputs/Project_matchUpdateManyWithoutPupilInput";
import { PupilUpdatelanguagesInput } from "../inputs/PupilUpdatelanguagesInput";
import { PupilUpdateprojectFieldsInput } from "../inputs/PupilUpdateprojectFieldsInput";
import { Pupil_tutoring_interest_confirmation_requestUpdateOneWithoutPupilInput } from "../inputs/Pupil_tutoring_interest_confirmation_requestUpdateOneWithoutPupilInput";
import { SchoolUpdateOneWithoutPupilInput } from "../inputs/SchoolUpdateOneWithoutPupilInput";
import { StringFieldUpdateOperationsInput } from "../inputs/StringFieldUpdateOperationsInput";
import { Subcourse_participants_pupilUpdateManyWithoutPupilInput } from "../inputs/Subcourse_participants_pupilUpdateManyWithoutPupilInput";
import { Subcourse_waiting_list_pupilUpdateManyWithoutPupilInput } from "../inputs/Subcourse_waiting_list_pupilUpdateManyWithoutPupilInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class PupilUpdateWithoutCourse_participation_certificateInput {
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

  @TypeGraphQL.Field(_type => Enumpupil_state_enumFieldUpdateOperationsInput, {
    nullable: true
  })
  state?: Enumpupil_state_enumFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => Enumpupil_schooltype_enumFieldUpdateOperationsInput, {
    nullable: true
  })
  schooltype?: Enumpupil_schooltype_enumFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableStringFieldUpdateOperationsInput, {
    nullable: true
  })
  msg?: NullableStringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableStringFieldUpdateOperationsInput, {
    nullable: true
  })
  grade?: NullableStringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => BoolFieldUpdateOperationsInput, {
    nullable: true
  })
  newsletter?: BoolFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => BoolFieldUpdateOperationsInput, {
    nullable: true
  })
  isPupil?: BoolFieldUpdateOperationsInput | undefined;

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
  isParticipant?: BoolFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => BoolFieldUpdateOperationsInput, {
    nullable: true
  })
  isProjectCoachee?: BoolFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => StringFieldUpdateOperationsInput, {
    nullable: true
  })
  isJufoParticipant?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => IntFieldUpdateOperationsInput, {
    nullable: true
  })
  openProjectMatchRequestCount?: IntFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => IntFieldUpdateOperationsInput, {
    nullable: true
  })
  projectMemberCount?: IntFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableEnumpupil_learninggermansince_enumFieldUpdateOperationsInput, {
    nullable: true
  })
  learningGermanSince?: NullableEnumpupil_learninggermansince_enumFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => IntFieldUpdateOperationsInput, {
    nullable: true
  })
  matchingPriority?: IntFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableDateTimeFieldUpdateOperationsInput, {
    nullable: true
  })
  lastUpdatedSettingsViaBlocker?: NullableDateTimeFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableStringFieldUpdateOperationsInput, {
    nullable: true
  })
  teacherEmailAddress?: NullableStringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => Enumpupil_registrationsource_enumFieldUpdateOperationsInput, {
    nullable: true
  })
  registrationSource?: Enumpupil_registrationsource_enumFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => PupilUpdateprojectFieldsInput, {
    nullable: true
  })
  projectFields?: PupilUpdateprojectFieldsInput | undefined;

  @TypeGraphQL.Field(_type => PupilUpdatelanguagesInput, {
    nullable: true
  })
  languages?: PupilUpdatelanguagesInput | undefined;

  @TypeGraphQL.Field(_type => SchoolUpdateOneWithoutPupilInput, {
    nullable: true
  })
  school?: SchoolUpdateOneWithoutPupilInput | undefined;

  @TypeGraphQL.Field(_type => Course_attendance_logUpdateManyWithoutPupilInput, {
    nullable: true
  })
  course_attendance_log?: Course_attendance_logUpdateManyWithoutPupilInput | undefined;

  @TypeGraphQL.Field(_type => MatchUpdateManyWithoutPupilInput, {
    nullable: true
  })
  match?: MatchUpdateManyWithoutPupilInput | undefined;

  @TypeGraphQL.Field(_type => Participation_certificateUpdateManyWithoutPupilInput, {
    nullable: true
  })
  participation_certificate?: Participation_certificateUpdateManyWithoutPupilInput | undefined;

  @TypeGraphQL.Field(_type => Project_matchUpdateManyWithoutPupilInput, {
    nullable: true
  })
  project_match?: Project_matchUpdateManyWithoutPupilInput | undefined;

  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestUpdateOneWithoutPupilInput, {
    nullable: true
  })
  pupil_tutoring_interest_confirmation_request?: Pupil_tutoring_interest_confirmation_requestUpdateOneWithoutPupilInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_participants_pupilUpdateManyWithoutPupilInput, {
    nullable: true
  })
  subcourse_participants_pupil?: Subcourse_participants_pupilUpdateManyWithoutPupilInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilUpdateManyWithoutPupilInput, {
    nullable: true
  })
  subcourse_waiting_list_pupil?: Subcourse_waiting_list_pupilUpdateManyWithoutPupilInput | undefined;
}
