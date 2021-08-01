import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BoolFilter } from "../inputs/BoolFilter";
import { Course_attendance_logListRelationFilter } from "../inputs/Course_attendance_logListRelationFilter";
import { Course_participation_certificateListRelationFilter } from "../inputs/Course_participation_certificateListRelationFilter";
import { DateTimeFilter } from "../inputs/DateTimeFilter";
import { DateTimeNullableFilter } from "../inputs/DateTimeNullableFilter";
import { Enumpupil_languages_enumNullableListFilter } from "../inputs/Enumpupil_languages_enumNullableListFilter";
import { Enumpupil_learninggermansince_enumNullableFilter } from "../inputs/Enumpupil_learninggermansince_enumNullableFilter";
import { Enumpupil_projectfields_enumNullableListFilter } from "../inputs/Enumpupil_projectfields_enumNullableListFilter";
import { Enumpupil_registrationsource_enumFilter } from "../inputs/Enumpupil_registrationsource_enumFilter";
import { Enumpupil_schooltype_enumFilter } from "../inputs/Enumpupil_schooltype_enumFilter";
import { Enumpupil_state_enumFilter } from "../inputs/Enumpupil_state_enumFilter";
import { IntFilter } from "../inputs/IntFilter";
import { IntNullableFilter } from "../inputs/IntNullableFilter";
import { MatchListRelationFilter } from "../inputs/MatchListRelationFilter";
import { Participation_certificateListRelationFilter } from "../inputs/Participation_certificateListRelationFilter";
import { Project_matchListRelationFilter } from "../inputs/Project_matchListRelationFilter";
import { Pupil_tutoring_interest_confirmation_requestRelationFilter } from "../inputs/Pupil_tutoring_interest_confirmation_requestRelationFilter";
import { SchoolRelationFilter } from "../inputs/SchoolRelationFilter";
import { StringFilter } from "../inputs/StringFilter";
import { StringNullableFilter } from "../inputs/StringNullableFilter";
import { Subcourse_participants_pupilListRelationFilter } from "../inputs/Subcourse_participants_pupilListRelationFilter";
import { Subcourse_waiting_list_pupilListRelationFilter } from "../inputs/Subcourse_waiting_list_pupilListRelationFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class PupilWhereInput {
  @TypeGraphQL.Field(_type => [PupilWhereInput], {
    nullable: true
  })
  AND?: PupilWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [PupilWhereInput], {
    nullable: true
  })
  OR?: PupilWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [PupilWhereInput], {
    nullable: true
  })
  NOT?: PupilWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  id?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeFilter, {
    nullable: true
  })
  createdAt?: DateTimeFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeFilter, {
    nullable: true
  })
  updatedAt?: DateTimeFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  firstname?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  lastname?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => BoolFilter, {
    nullable: true
  })
  active?: BoolFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  email?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  verification?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeNullableFilter, {
    nullable: true
  })
  verifiedAt?: DateTimeNullableFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  authToken?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => BoolFilter, {
    nullable: true
  })
  authTokenUsed?: BoolFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeNullableFilter, {
    nullable: true
  })
  authTokenSent?: DateTimeNullableFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  wix_id?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeFilter, {
    nullable: true
  })
  wix_creation_date?: DateTimeFilter | undefined;

  @TypeGraphQL.Field(_type => Enumpupil_state_enumFilter, {
    nullable: true
  })
  state?: Enumpupil_state_enumFilter | undefined;

  @TypeGraphQL.Field(_type => Enumpupil_schooltype_enumFilter, {
    nullable: true
  })
  schooltype?: Enumpupil_schooltype_enumFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  msg?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  grade?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => BoolFilter, {
    nullable: true
  })
  newsletter?: BoolFilter | undefined;

  @TypeGraphQL.Field(_type => BoolFilter, {
    nullable: true
  })
  isPupil?: BoolFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  subjects?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  openMatchRequestCount?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => BoolFilter, {
    nullable: true
  })
  isParticipant?: BoolFilter | undefined;

  @TypeGraphQL.Field(_type => BoolFilter, {
    nullable: true
  })
  isProjectCoachee?: BoolFilter | undefined;

  @TypeGraphQL.Field(_type => Enumpupil_projectfields_enumNullableListFilter, {
    nullable: true
  })
  projectFields?: Enumpupil_projectfields_enumNullableListFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  isJufoParticipant?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  openProjectMatchRequestCount?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  projectMemberCount?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => Enumpupil_languages_enumNullableListFilter, {
    nullable: true
  })
  languages?: Enumpupil_languages_enumNullableListFilter | undefined;

  @TypeGraphQL.Field(_type => Enumpupil_learninggermansince_enumNullableFilter, {
    nullable: true
  })
  learningGermanSince?: Enumpupil_learninggermansince_enumNullableFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  matchingPriority?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeNullableFilter, {
    nullable: true
  })
  lastUpdatedSettingsViaBlocker?: DateTimeNullableFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  teacherEmailAddress?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => Enumpupil_registrationsource_enumFilter, {
    nullable: true
  })
  registrationSource?: Enumpupil_registrationsource_enumFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true
  })
  schoolId?: IntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => SchoolRelationFilter, {
    nullable: true
  })
  school?: SchoolRelationFilter | undefined;

  @TypeGraphQL.Field(_type => Course_attendance_logListRelationFilter, {
    nullable: true
  })
  course_attendance_log?: Course_attendance_logListRelationFilter | undefined;

  @TypeGraphQL.Field(_type => Course_participation_certificateListRelationFilter, {
    nullable: true
  })
  course_participation_certificate?: Course_participation_certificateListRelationFilter | undefined;

  @TypeGraphQL.Field(_type => MatchListRelationFilter, {
    nullable: true
  })
  match?: MatchListRelationFilter | undefined;

  @TypeGraphQL.Field(_type => Participation_certificateListRelationFilter, {
    nullable: true
  })
  participation_certificate?: Participation_certificateListRelationFilter | undefined;

  @TypeGraphQL.Field(_type => Project_matchListRelationFilter, {
    nullable: true
  })
  project_match?: Project_matchListRelationFilter | undefined;

  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestRelationFilter, {
    nullable: true
  })
  pupil_tutoring_interest_confirmation_request?: Pupil_tutoring_interest_confirmation_requestRelationFilter | undefined;

  @TypeGraphQL.Field(_type => Subcourse_participants_pupilListRelationFilter, {
    nullable: true
  })
  subcourse_participants_pupil?: Subcourse_participants_pupilListRelationFilter | undefined;

  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilListRelationFilter, {
    nullable: true
  })
  subcourse_waiting_list_pupil?: Subcourse_waiting_list_pupilListRelationFilter | undefined;
}
