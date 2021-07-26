import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_attendance_logCreateNestedManyWithoutPupilInput } from "../inputs/Course_attendance_logCreateNestedManyWithoutPupilInput";
import { MatchCreateNestedManyWithoutPupilInput } from "../inputs/MatchCreateNestedManyWithoutPupilInput";
import { Participation_certificateCreateNestedManyWithoutPupilInput } from "../inputs/Participation_certificateCreateNestedManyWithoutPupilInput";
import { Project_matchCreateNestedManyWithoutPupilInput } from "../inputs/Project_matchCreateNestedManyWithoutPupilInput";
import { PupilCreatelanguagesInput } from "../inputs/PupilCreatelanguagesInput";
import { PupilCreateprojectFieldsInput } from "../inputs/PupilCreateprojectFieldsInput";
import { Subcourse_participants_pupilCreateNestedManyWithoutPupilInput } from "../inputs/Subcourse_participants_pupilCreateNestedManyWithoutPupilInput";
import { Subcourse_waiting_list_pupilCreateNestedManyWithoutPupilInput } from "../inputs/Subcourse_waiting_list_pupilCreateNestedManyWithoutPupilInput";
import { learning_german_since } from "../../enums/learning_german_since";
import { pupil_registrationsource_enum } from "../../enums/pupil_registrationsource_enum";
import { pupil_schooltype_enum } from "../../enums/pupil_schooltype_enum";
import { pupil_state_enum } from "../../enums/pupil_state_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class PupilCreateWithoutSchoolInput {
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
  subjects?: string | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  msg?: string | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  grade?: string | undefined;

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

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  openMatchRequestCount?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  matchingPriority?: number | undefined;

  @TypeGraphQL.Field(_type => pupil_schooltype_enum, {
    nullable: true
  })
  schooltype?: "grundschule" | "gesamtschule" | "hauptschule" | "realschule" | "gymnasium" | "f_rderschule" | "berufsschule" | "other" | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  newsletter?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  isPupil?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  isParticipant?: boolean | undefined;

  @TypeGraphQL.Field(_type => pupil_state_enum, {
    nullable: true
  })
  state?: "bw" | "by" | "be" | "bb" | "hb" | "hh" | "he" | "mv" | "ni" | "nw" | "rp" | "sl" | "sn" | "st" | "sh" | "th" | "other" | undefined;

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

  @TypeGraphQL.Field(_type => learning_german_since, {
    nullable: true
  })
  learningGermanSince?: "greaterThanFour" | "twoToFour" | "oneToTwo" | "lessThanOne" | undefined;

  @TypeGraphQL.Field(_type => PupilCreateprojectFieldsInput, {
    nullable: true
  })
  projectFields?: PupilCreateprojectFieldsInput | undefined;

  @TypeGraphQL.Field(_type => PupilCreatelanguagesInput, {
    nullable: true
  })
  languages?: PupilCreatelanguagesInput | undefined;

  @TypeGraphQL.Field(_type => Course_attendance_logCreateNestedManyWithoutPupilInput, {
    nullable: true
  })
  course_attendance_log?: Course_attendance_logCreateNestedManyWithoutPupilInput | undefined;

  @TypeGraphQL.Field(_type => MatchCreateNestedManyWithoutPupilInput, {
    nullable: true
  })
  match?: MatchCreateNestedManyWithoutPupilInput | undefined;

  @TypeGraphQL.Field(_type => Participation_certificateCreateNestedManyWithoutPupilInput, {
    nullable: true
  })
  participation_certificate?: Participation_certificateCreateNestedManyWithoutPupilInput | undefined;

  @TypeGraphQL.Field(_type => Project_matchCreateNestedManyWithoutPupilInput, {
    nullable: true
  })
  project_match?: Project_matchCreateNestedManyWithoutPupilInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_participants_pupilCreateNestedManyWithoutPupilInput, {
    nullable: true
  })
  subcourse_participants_pupil?: Subcourse_participants_pupilCreateNestedManyWithoutPupilInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilCreateNestedManyWithoutPupilInput, {
    nullable: true
  })
  subcourse_waiting_list_pupil?: Subcourse_waiting_list_pupilCreateNestedManyWithoutPupilInput | undefined;
}
