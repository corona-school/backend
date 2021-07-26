import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../scalars";
import { Course_attendance_log } from "../models/Course_attendance_log";
import { Match } from "../models/Match";
import { Participation_certificate } from "../models/Participation_certificate";
import { Project_match } from "../models/Project_match";
import { School } from "../models/School";
import { Subcourse_participants_pupil } from "../models/Subcourse_participants_pupil";
import { Subcourse_waiting_list_pupil } from "../models/Subcourse_waiting_list_pupil";
import { language } from "../enums/language";
import { learning_german_since } from "../enums/learning_german_since";
import { pupil_projectfields_enum } from "../enums/pupil_projectfields_enum";
import { pupil_registrationsource_enum } from "../enums/pupil_registrationsource_enum";
import { pupil_schooltype_enum } from "../enums/pupil_schooltype_enum";
import { pupil_state_enum } from "../enums/pupil_state_enum";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class Pupil {
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
  subjects?: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  msg?: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  grade?: string | null;

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

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  openMatchRequestCount!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  matchingPriority!: number;

  @TypeGraphQL.Field(_type => pupil_schooltype_enum, {
    nullable: false
  })
  schooltype!: "grundschule" | "gesamtschule" | "hauptschule" | "realschule" | "gymnasium" | "f_rderschule" | "berufsschule" | "other";

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  newsletter!: boolean;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  isPupil!: boolean;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  isParticipant!: boolean;

  @TypeGraphQL.Field(_type => pupil_state_enum, {
    nullable: false
  })
  state!: "bw" | "by" | "be" | "bb" | "hb" | "hh" | "he" | "mv" | "ni" | "nw" | "rp" | "sl" | "sn" | "st" | "sh" | "th" | "other";

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  lastUpdatedSettingsViaBlocker?: Date | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  teacherEmailAddress?: string | null;

  @TypeGraphQL.Field(_type => pupil_registrationsource_enum, {
    nullable: false
  })
  registrationSource!: "normal" | "cooperation" | "drehtuer" | "other";

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  schoolId?: number | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  isProjectCoachee!: boolean;

  @TypeGraphQL.Field(_type => [pupil_projectfields_enum], {
    nullable: false
  })
  projectFields!: Array<"Arbeitswelt" | "Biologie" | "Chemie" | "Geo_und_Raumwissenschaften" | "Mathematik_Informatik" | "Physik" | "Technik">;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  isJufoParticipant!: string;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  openProjectMatchRequestCount!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  projectMemberCount!: number;

  school?: School | null;

  course_attendance_log?: Course_attendance_log[];

  match?: Match[];

  participation_certificate?: Participation_certificate[];

  project_match?: Project_match[];

  @TypeGraphQL.Field(_type => [language], {
    nullable: false
  })
  languages!: Array<"sq" | "ar" | "hy" | "az" | "bs" | "bg" | "zh" | "de" | "en" | "fr" | "it" | "kk" | "ku" | "pl" | "pt" | "ru" | "tr" | "es" | "uk" | "vi" | "other">;

  @TypeGraphQL.Field(_type => learning_german_since, {
    nullable: true
  })
  learningGermanSince?: "greaterThanFour" | "twoToFour" | "oneToTwo" | "lessThanOne" | null;

  subcourse_participants_pupil?: Subcourse_participants_pupil[];

  subcourse_waiting_list_pupil?: Subcourse_waiting_list_pupil[];
}
