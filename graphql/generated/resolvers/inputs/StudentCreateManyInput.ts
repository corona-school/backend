import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreatelanguagesInput } from "../inputs/StudentCreatelanguagesInput";
import { student_module_enum } from "../../enums/student_module_enum";
import { student_registrationsource_enum } from "../../enums/student_registrationsource_enum";
import { student_state_enum } from "../../enums/student_state_enum";

@TypeGraphQL.InputType("StudentCreateManyInput", {
  isAbstract: true
})
export class StudentCreateManyInput {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  id?: number | undefined;

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
  isCodu?: boolean | undefined;

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

  @TypeGraphQL.Field(_type => StudentCreatelanguagesInput, {
    nullable: true
  })
  languages?: StudentCreatelanguagesInput | undefined;

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
  registrationSource?: "normal" | "cooperation" | "drehtuer" | "other" | "codu" | undefined;
}
