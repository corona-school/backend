import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { student_module_enum } from "../../enums/student_module_enum";
import { student_registrationsource_enum } from "../../enums/student_registrationsource_enum";
import { student_state_enum } from "../../enums/student_state_enum";

@TypeGraphQL.ObjectType("StudentMaxAggregate", {
  isAbstract: true
})
export class StudentMaxAggregate {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  id!: number | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  createdAt!: Date | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  updatedAt!: Date | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  firstname!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  lastname!: string | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  active!: boolean | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  email!: string | null;

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
    nullable: true
  })
  authTokenUsed!: boolean | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  authTokenSent!: Date | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  wix_id!: string | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  wix_creation_date!: Date | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  phone!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  feedback!: string | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  newsletter!: boolean | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  isStudent!: boolean | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  subjects!: string | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  openMatchRequestCount!: number | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  isCodu!: boolean | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  isInstructor!: boolean | null;

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
    nullable: true
  })
  isProjectCoach!: boolean | null;

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
    nullable: true
  })
  openProjectMatchRequestCount!: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  sentJufoAlumniScreeningReminderCount!: number | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  lastSentJufoAlumniScreeningInvitationDate!: Date | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  supportsInDaZ!: boolean | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  sentScreeningReminderCount!: number | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  lastSentScreeningInvitationDate!: Date | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  sentInstructorScreeningReminderCount!: number | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  lastSentInstructorScreeningInvitationDate!: Date | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  lastUpdatedSettingsViaBlocker!: Date | null;

  @TypeGraphQL.Field(_type => student_registrationsource_enum, {
    nullable: true
  })
  registrationSource!: "normal" | "cooperation" | "drehtuer" | "other" | "codu" | "plus" | null;
}
