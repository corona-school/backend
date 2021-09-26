import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../scalars";
import { Certificate_of_conduct } from "../models/Certificate_of_conduct";
import { Course } from "../models/Course";
import { Course_guest } from "../models/Course_guest";
import { Course_instructors_student } from "../models/Course_instructors_student";
import { Course_participation_certificate } from "../models/Course_participation_certificate";
import { Expert_data } from "../models/Expert_data";
import { Instructor_screening } from "../models/Instructor_screening";
import { Jufo_verification_transmission } from "../models/Jufo_verification_transmission";
import { Lecture } from "../models/Lecture";
import { Match } from "../models/Match";
import { Participation_certificate } from "../models/Participation_certificate";
import { Project_coaching_screening } from "../models/Project_coaching_screening";
import { Project_field_with_grade_restriction } from "../models/Project_field_with_grade_restriction";
import { Project_match } from "../models/Project_match";
import { Screening } from "../models/Screening";
import { Subcourse_instructors_student } from "../models/Subcourse_instructors_student";
import { student_languages_enum } from "../enums/student_languages_enum";
import { student_module_enum } from "../enums/student_module_enum";
import { student_registrationsource_enum } from "../enums/student_registrationsource_enum";
import { student_state_enum } from "../enums/student_state_enum";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class Student {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  id!: number;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  createdAt!: Date;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  updatedAt!: Date;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  firstname?: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  lastname?: string | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  active!: boolean;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  email!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  verification?: string | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  verifiedAt?: Date | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  authToken?: string | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  authTokenUsed!: boolean;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  authTokenSent?: Date | null;

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
  phone?: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  feedback?: string | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  newsletter!: boolean;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  isStudent!: boolean;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  subjects?: string | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  openMatchRequestCount!: number;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  isInstructor!: boolean;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  msg?: string | null;

  @TypeGraphQL.Field(_type => student_state_enum, {
    nullable: true
  })
  state?: "bw" | "by" | "be" | "bb" | "hb" | "hh" | "he" | "mv" | "ni" | "nw" | "rp" | "sl" | "sn" | "st" | "sh" | "th" | "other" | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  university?: string | null;

  @TypeGraphQL.Field(_type => student_module_enum, {
    nullable: true
  })
  module?: "internship" | "seminar" | "other" | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  moduleHours?: number | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  isProjectCoach!: boolean;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  wasJufoParticipant?: string | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  hasJufoCertificate?: boolean | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  jufoPastParticipationInfo?: string | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  jufoPastParticipationConfirmed?: boolean | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  isUniversityStudent?: boolean | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  openProjectMatchRequestCount!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  sentJufoAlumniScreeningReminderCount!: number;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  lastSentJufoAlumniScreeningInvitationDate?: Date | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  supportsInDaZ?: boolean | null;

  @TypeGraphQL.Field(_type => [student_languages_enum], {
    nullable: false
  })
  languages!: Array<"Albanisch" | "Arabisch" | "Armenisch" | "Aserbaidschanisch" | "Bosnisch" | "Bulgarisch" | "Chinesisch" | "Deutsch" | "Englisch" | "Franz_sisch" | "Italienisch" | "Kasachisch" | "Kurdisch" | "Polnisch" | "Portugiesisch" | "Russisch" | "T_rkisch" | "Spanisch" | "Ukrainisch" | "Vietnamesisch" | "Andere">;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  sentScreeningReminderCount!: number;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  lastSentScreeningInvitationDate?: Date | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  sentInstructorScreeningReminderCount!: number;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  lastSentInstructorScreeningInvitationDate?: Date | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  lastUpdatedSettingsViaBlocker?: Date | null;

  @TypeGraphQL.Field(_type => student_registrationsource_enum, {
    nullable: false
  })
  registrationSource!: "normal" | "cooperation" | "drehtuer" | "other";

  course?: Course[];

  course_guest?: Course_guest[];

  course_instructors_student?: Course_instructors_student[];

  course_participation_certificate?: Course_participation_certificate[];

  expert_data?: Expert_data | null;

  instructor_screening?: Instructor_screening | null;

  jufo_verification_transmission?: Jufo_verification_transmission | null;

  lecture?: Lecture[];

  match?: Match[];

  participation_certificate?: Participation_certificate[];

  project_coaching_screening?: Project_coaching_screening | null;

  project_field_with_grade_restriction?: Project_field_with_grade_restriction[];

  project_match?: Project_match[];

  screening?: Screening | null;

  subcourse_instructors_student?: Subcourse_instructors_student[];

  certificate_of_conduct?: Certificate_of_conduct[];
}
