import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilAvgAggregate } from "../outputs/PupilAvgAggregate";
import { PupilCountAggregate } from "../outputs/PupilCountAggregate";
import { PupilMaxAggregate } from "../outputs/PupilMaxAggregate";
import { PupilMinAggregate } from "../outputs/PupilMinAggregate";
import { PupilSumAggregate } from "../outputs/PupilSumAggregate";
import { pupil_languages_enum } from "../../enums/pupil_languages_enum";
import { pupil_learninggermansince_enum } from "../../enums/pupil_learninggermansince_enum";
import { pupil_projectfields_enum } from "../../enums/pupil_projectfields_enum";
import { pupil_registrationsource_enum } from "../../enums/pupil_registrationsource_enum";
import { pupil_schooltype_enum } from "../../enums/pupil_schooltype_enum";
import { pupil_state_enum } from "../../enums/pupil_state_enum";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class PupilGroupBy {
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

  @TypeGraphQL.Field(_type => pupil_state_enum, {
    nullable: false
  })
  state!: "bw" | "by" | "be" | "bb" | "hb" | "hh" | "he" | "mv" | "ni" | "nw" | "rp" | "sl" | "sn" | "st" | "sh" | "th" | "other";

  @TypeGraphQL.Field(_type => pupil_schooltype_enum, {
    nullable: false
  })
  schooltype!: "grundschule" | "gesamtschule" | "hauptschule" | "realschule" | "gymnasium" | "f_rderschule" | "berufsschule" | "other";

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  msg!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  grade!: string | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  newsletter!: boolean;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  isPupil!: boolean;

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
  isParticipant!: boolean;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  isProjectCoachee!: boolean;

  @TypeGraphQL.Field(_type => [pupil_projectfields_enum], {
    nullable: true
  })
  projectFields!: Array<"Arbeitswelt" | "Biologie" | "Chemie" | "Geo_und_Raumwissenschaften" | "Mathematik_Informatik" | "Physik" | "Technik"> | null;

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

  @TypeGraphQL.Field(_type => [pupil_languages_enum], {
    nullable: true
  })
  languages!: Array<"Albanisch" | "Arabisch" | "Armenisch" | "Aserbaidschanisch" | "Bosnisch" | "Bulgarisch" | "Chinesisch" | "Deutsch" | "Englisch" | "Franz_sisch" | "Italienisch" | "Kasachisch" | "Kurdisch" | "Polnisch" | "Portugiesisch" | "Russisch" | "T_rkisch" | "Spanisch" | "Ukrainisch" | "Vietnamesisch" | "Andere"> | null;

  @TypeGraphQL.Field(_type => pupil_learninggermansince_enum, {
    nullable: true
  })
  learningGermanSince!: "more_than_four" | "two_to_four" | "one_to_two" | "less_than_one" | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  matchingPriority!: number;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  lastUpdatedSettingsViaBlocker!: Date | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  teacherEmailAddress!: string | null;

  @TypeGraphQL.Field(_type => pupil_registrationsource_enum, {
    nullable: false
  })
  registrationSource!: "normal" | "cooperation" | "drehtuer" | "other";

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  schoolId!: number | null;

  @TypeGraphQL.Field(_type => PupilCountAggregate, {
    nullable: true
  })
  _count!: PupilCountAggregate | null;

  @TypeGraphQL.Field(_type => PupilAvgAggregate, {
    nullable: true
  })
  _avg!: PupilAvgAggregate | null;

  @TypeGraphQL.Field(_type => PupilSumAggregate, {
    nullable: true
  })
  _sum!: PupilSumAggregate | null;

  @TypeGraphQL.Field(_type => PupilMinAggregate, {
    nullable: true
  })
  _min!: PupilMinAggregate | null;

  @TypeGraphQL.Field(_type => PupilMaxAggregate, {
    nullable: true
  })
  _max!: PupilMaxAggregate | null;
}
