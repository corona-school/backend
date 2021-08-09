import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentAvgAggregate } from "../outputs/StudentAvgAggregate";
import { StudentCountAggregate } from "../outputs/StudentCountAggregate";
import { StudentMaxAggregate } from "../outputs/StudentMaxAggregate";
import { StudentMinAggregate } from "../outputs/StudentMinAggregate";
import { StudentSumAggregate } from "../outputs/StudentSumAggregate";
import { student_languages_enum } from "../../enums/student_languages_enum";
import { student_module_enum } from "../../enums/student_module_enum";
import { student_registrationsource_enum } from "../../enums/student_registrationsource_enum";
import { student_state_enum } from "../../enums/student_state_enum";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class StudentGroupBy {
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
  firstname!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  lastname!: string | null;

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
  verification!: string | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  verifiedAt!: Date | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  authToken!: string | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  authTokenUsed!: boolean;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  authTokenSent!: Date | null;

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
  phone!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  feedback!: string | null;

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
  subjects!: string | null;

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
  msg!: string | null;

  @TypeGraphQL.Field(_type => student_state_enum, {
    nullable: true
  })
  state!: "bw" | "by" | "be" | "bb" | "hb" | "hh" | "he" | "mv" | "ni" | "nw" | "rp" | "sl" | "sn" | "st" | "sh" | "th" | "other" | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  university!: string | null;

  @TypeGraphQL.Field(_type => student_module_enum, {
    nullable: true
  })
  module!: "internship" | "seminar" | "other" | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  moduleHours!: number | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  isProjectCoach!: boolean;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  wasJufoParticipant!: string | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  hasJufoCertificate!: boolean | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  jufoPastParticipationInfo!: string | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  jufoPastParticipationConfirmed!: boolean | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  isUniversityStudent!: boolean | null;

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
  lastSentJufoAlumniScreeningInvitationDate!: Date | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  supportsInDaZ!: boolean | null;

  @TypeGraphQL.Field(_type => [student_languages_enum], {
    nullable: true
  })
  languages!: Array<"Albanisch" | "Arabisch" | "Armenisch" | "Aserbaidschanisch" | "Bosnisch" | "Bulgarisch" | "Chinesisch" | "Deutsch" | "Englisch" | "Franz_sisch" | "Italienisch" | "Kasachisch" | "Kurdisch" | "Polnisch" | "Portugiesisch" | "Russisch" | "T_rkisch" | "Spanisch" | "Ukrainisch" | "Vietnamesisch" | "Andere"> | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  sentScreeningReminderCount!: number;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  lastSentScreeningInvitationDate!: Date | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  sentInstructorScreeningReminderCount!: number;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  lastSentInstructorScreeningInvitationDate!: Date | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  lastUpdatedSettingsViaBlocker!: Date | null;

  @TypeGraphQL.Field(_type => student_registrationsource_enum, {
    nullable: false
  })
  registrationSource!: "normal" | "cooperation" | "drehtuer" | "other";

  @TypeGraphQL.Field(_type => StudentCountAggregate, {
    nullable: true
  })
  _count!: StudentCountAggregate | null;

  @TypeGraphQL.Field(_type => StudentAvgAggregate, {
    nullable: true
  })
  _avg!: StudentAvgAggregate | null;

  @TypeGraphQL.Field(_type => StudentSumAggregate, {
    nullable: true
  })
  _sum!: StudentSumAggregate | null;

  @TypeGraphQL.Field(_type => StudentMinAggregate, {
    nullable: true
  })
  _min!: StudentMinAggregate | null;

  @TypeGraphQL.Field(_type => StudentMaxAggregate, {
    nullable: true
  })
  _max!: StudentMaxAggregate | null;
}
