import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { pupil_learninggermansince_enum } from "../../enums/pupil_learninggermansince_enum";
import { pupil_registrationsource_enum } from "../../enums/pupil_registrationsource_enum";
import { pupil_schooltype_enum } from "../../enums/pupil_schooltype_enum";
import { pupil_state_enum } from "../../enums/pupil_state_enum";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class PupilMaxAggregate {
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

  @TypeGraphQL.Field(_type => pupil_state_enum, {
    nullable: true
  })
  state!: "bw" | "by" | "be" | "bb" | "hb" | "hh" | "he" | "mv" | "ni" | "nw" | "rp" | "sl" | "sn" | "st" | "sh" | "th" | "other" | null;

  @TypeGraphQL.Field(_type => pupil_schooltype_enum, {
    nullable: true
  })
  schooltype!: "grundschule" | "gesamtschule" | "hauptschule" | "realschule" | "gymnasium" | "f_rderschule" | "berufsschule" | "other" | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  msg!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  grade!: string | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  newsletter!: boolean | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  isPupil!: boolean | null;

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
  isParticipant!: boolean | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  isProjectCoachee!: boolean | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  isJufoParticipant!: string | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  openProjectMatchRequestCount!: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  projectMemberCount!: number | null;

  @TypeGraphQL.Field(_type => pupil_learninggermansince_enum, {
    nullable: true
  })
  learningGermanSince!: "more_than_four" | "two_to_four" | "one_to_two" | "less_than_one" | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  matchingPriority!: number | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  lastUpdatedSettingsViaBlocker!: Date | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  teacherEmailAddress!: string | null;

  @TypeGraphQL.Field(_type => pupil_registrationsource_enum, {
    nullable: true
  })
  registrationSource!: "normal" | "cooperation" | "drehtuer" | "other" | "codu" | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  coduToken!: string | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  schoolId!: number | null;
}
