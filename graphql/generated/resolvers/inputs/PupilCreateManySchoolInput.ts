import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateManylanguagesInput } from "../inputs/PupilCreateManylanguagesInput";
import { PupilCreateManyprojectFieldsInput } from "../inputs/PupilCreateManyprojectFieldsInput";
import { pupil_learninggermansince_enum } from "../../enums/pupil_learninggermansince_enum";
import { pupil_registrationsource_enum } from "../../enums/pupil_registrationsource_enum";
import { pupil_schooltype_enum } from "../../enums/pupil_schooltype_enum";
import { pupil_state_enum } from "../../enums/pupil_state_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class PupilCreateManySchoolInput {
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

  @TypeGraphQL.Field(_type => pupil_state_enum, {
    nullable: true
  })
  state?: "bw" | "by" | "be" | "bb" | "hb" | "hh" | "he" | "mv" | "ni" | "nw" | "rp" | "sl" | "sn" | "st" | "sh" | "th" | "other" | undefined;

  @TypeGraphQL.Field(_type => pupil_schooltype_enum, {
    nullable: true
  })
  schooltype?: "grundschule" | "gesamtschule" | "hauptschule" | "realschule" | "gymnasium" | "f_rderschule" | "berufsschule" | "other" | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  msg?: string | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  grade?: string | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  newsletter?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  isPupil?: boolean | undefined;

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
  isParticipant?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  isProjectCoachee?: boolean | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  isJufoParticipant?: string | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  openProjectMatchRequestCount?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  projectMemberCount?: number | undefined;

  @TypeGraphQL.Field(_type => pupil_learninggermansince_enum, {
    nullable: true
  })
  learningGermanSince?: "more_than_four" | "two_to_four" | "one_to_two" | "less_than_one" | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  matchingPriority?: number | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  lastUpdatedSettingsViaBlocker?: Date | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  teacherEmailAddress?: string | undefined;

  @TypeGraphQL.Field(_type => pupil_registrationsource_enum, {
    nullable: true
  })
  registrationSource?: "normal" | "cooperation" | "drehtuer" | "other" | undefined;

  @TypeGraphQL.Field(_type => PupilCreateManyprojectFieldsInput, {
    nullable: true
  })
  projectFields?: PupilCreateManyprojectFieldsInput | undefined;

  @TypeGraphQL.Field(_type => PupilCreateManylanguagesInput, {
    nullable: true
  })
  languages?: PupilCreateManylanguagesInput | undefined;
}
