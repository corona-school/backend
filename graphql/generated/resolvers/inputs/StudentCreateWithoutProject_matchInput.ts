import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseCreateNestedManyWithoutStudentInput } from "../inputs/CourseCreateNestedManyWithoutStudentInput";
import { Course_guestCreateNestedManyWithoutStudentInput } from "../inputs/Course_guestCreateNestedManyWithoutStudentInput";
import { Course_instructors_studentCreateNestedManyWithoutStudentInput } from "../inputs/Course_instructors_studentCreateNestedManyWithoutStudentInput";
import { Course_participation_certificateCreateNestedManyWithoutStudentInput } from "../inputs/Course_participation_certificateCreateNestedManyWithoutStudentInput";
import { Expert_dataCreateNestedOneWithoutStudentInput } from "../inputs/Expert_dataCreateNestedOneWithoutStudentInput";
import { Instructor_screeningCreateNestedOneWithoutStudentInput } from "../inputs/Instructor_screeningCreateNestedOneWithoutStudentInput";
import { Jufo_verification_transmissionCreateNestedOneWithoutStudentInput } from "../inputs/Jufo_verification_transmissionCreateNestedOneWithoutStudentInput";
import { LectureCreateNestedManyWithoutStudentInput } from "../inputs/LectureCreateNestedManyWithoutStudentInput";
import { MatchCreateNestedManyWithoutStudentInput } from "../inputs/MatchCreateNestedManyWithoutStudentInput";
import { Participation_certificateCreateNestedManyWithoutStudentInput } from "../inputs/Participation_certificateCreateNestedManyWithoutStudentInput";
import { Project_coaching_screeningCreateNestedOneWithoutStudentInput } from "../inputs/Project_coaching_screeningCreateNestedOneWithoutStudentInput";
import { Project_field_with_grade_restrictionCreateNestedManyWithoutStudentInput } from "../inputs/Project_field_with_grade_restrictionCreateNestedManyWithoutStudentInput";
import { ScreeningCreateNestedOneWithoutStudentInput } from "../inputs/ScreeningCreateNestedOneWithoutStudentInput";
import { StudentCreatelanguagesInput } from "../inputs/StudentCreatelanguagesInput";
import { Subcourse_instructors_studentCreateNestedManyWithoutStudentInput } from "../inputs/Subcourse_instructors_studentCreateNestedManyWithoutStudentInput";
import { student_module_enum } from "../../enums/student_module_enum";
import { student_registrationsource_enum } from "../../enums/student_registrationsource_enum";
import { student_state_enum } from "../../enums/student_state_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class StudentCreateWithoutProject_matchInput {
  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  createdAt?: Date | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  updatedAt?: Date | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  firstname?: string | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  lastname?: string | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  active?: boolean | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  email!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  verification?: string | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  verifiedAt?: Date | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  authToken?: string | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  authTokenUsed?: boolean | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  authTokenSent?: Date | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  wix_id!: string;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  wix_creation_date!: Date;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  phone?: string | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  feedback?: string | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  newsletter?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  isStudent?: boolean | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  subjects?: string | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  openMatchRequestCount?: number | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  isInstructor?: boolean | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  msg?: string | undefined;

  @TypeGraphQL.Field(_type => student_state_enum, {
    nullable: true
  })
  state?: "bw" | "by" | "be" | "bb" | "hb" | "hh" | "he" | "mv" | "ni" | "nw" | "rp" | "sl" | "sn" | "st" | "sh" | "th" | "other" | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  university?: string | undefined;

  @TypeGraphQL.Field(_type => student_module_enum, {
    nullable: true
  })
  module?: "internship" | "seminar" | "other" | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  moduleHours?: number | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  isProjectCoach?: boolean | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  wasJufoParticipant?: string | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  hasJufoCertificate?: boolean | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  jufoPastParticipationInfo?: string | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  jufoPastParticipationConfirmed?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  isUniversityStudent?: boolean | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  openProjectMatchRequestCount?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  sentJufoAlumniScreeningReminderCount?: number | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  lastSentJufoAlumniScreeningInvitationDate?: Date | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  supportsInDaZ?: boolean | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  sentScreeningReminderCount?: number | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  lastSentScreeningInvitationDate?: Date | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  sentInstructorScreeningReminderCount?: number | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  lastSentInstructorScreeningInvitationDate?: Date | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  lastUpdatedSettingsViaBlocker?: Date | undefined;

  @TypeGraphQL.Field(_type => student_registrationsource_enum, {
    nullable: true
  })
  registrationSource?: "normal" | "cooperation" | "drehtuer" | "other" | undefined;

  @TypeGraphQL.Field(_type => StudentCreatelanguagesInput, {
    nullable: true
  })
  languages?: StudentCreatelanguagesInput | undefined;

  @TypeGraphQL.Field(_type => CourseCreateNestedManyWithoutStudentInput, {
    nullable: true
  })
  course?: CourseCreateNestedManyWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Course_guestCreateNestedManyWithoutStudentInput, {
    nullable: true
  })
  course_guest?: Course_guestCreateNestedManyWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Course_instructors_studentCreateNestedManyWithoutStudentInput, {
    nullable: true
  })
  course_instructors_student?: Course_instructors_studentCreateNestedManyWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Course_participation_certificateCreateNestedManyWithoutStudentInput, {
    nullable: true
  })
  course_participation_certificate?: Course_participation_certificateCreateNestedManyWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Expert_dataCreateNestedOneWithoutStudentInput, {
    nullable: true
  })
  expert_data?: Expert_dataCreateNestedOneWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Instructor_screeningCreateNestedOneWithoutStudentInput, {
    nullable: true
  })
  instructor_screening?: Instructor_screeningCreateNestedOneWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Jufo_verification_transmissionCreateNestedOneWithoutStudentInput, {
    nullable: true
  })
  jufo_verification_transmission?: Jufo_verification_transmissionCreateNestedOneWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => LectureCreateNestedManyWithoutStudentInput, {
    nullable: true
  })
  lecture?: LectureCreateNestedManyWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => MatchCreateNestedManyWithoutStudentInput, {
    nullable: true
  })
  match?: MatchCreateNestedManyWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Participation_certificateCreateNestedManyWithoutStudentInput, {
    nullable: true
  })
  participation_certificate?: Participation_certificateCreateNestedManyWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Project_coaching_screeningCreateNestedOneWithoutStudentInput, {
    nullable: true
  })
  project_coaching_screening?: Project_coaching_screeningCreateNestedOneWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Project_field_with_grade_restrictionCreateNestedManyWithoutStudentInput, {
    nullable: true
  })
  project_field_with_grade_restriction?: Project_field_with_grade_restrictionCreateNestedManyWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => ScreeningCreateNestedOneWithoutStudentInput, {
    nullable: true
  })
  screening?: ScreeningCreateNestedOneWithoutStudentInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_instructors_studentCreateNestedManyWithoutStudentInput, {
    nullable: true
  })
  subcourse_instructors_student?: Subcourse_instructors_studentCreateNestedManyWithoutStudentInput | undefined;
}
