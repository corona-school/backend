import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BoolFilter } from "../inputs/BoolFilter";
import { BoolNullableFilter } from "../inputs/BoolNullableFilter";
import { Certificate_of_conductRelationFilter } from "../inputs/Certificate_of_conductRelationFilter";
import { CourseListRelationFilter } from "../inputs/CourseListRelationFilter";
import { Course_guestListRelationFilter } from "../inputs/Course_guestListRelationFilter";
import { Course_instructors_studentListRelationFilter } from "../inputs/Course_instructors_studentListRelationFilter";
import { Course_participation_certificateListRelationFilter } from "../inputs/Course_participation_certificateListRelationFilter";
import { DateTimeFilter } from "../inputs/DateTimeFilter";
import { DateTimeNullableFilter } from "../inputs/DateTimeNullableFilter";
import { Enumstudent_languages_enumNullableListFilter } from "../inputs/Enumstudent_languages_enumNullableListFilter";
import { Enumstudent_module_enumNullableFilter } from "../inputs/Enumstudent_module_enumNullableFilter";
import { Enumstudent_registrationsource_enumFilter } from "../inputs/Enumstudent_registrationsource_enumFilter";
import { Enumstudent_state_enumNullableFilter } from "../inputs/Enumstudent_state_enumNullableFilter";
import { Expert_dataRelationFilter } from "../inputs/Expert_dataRelationFilter";
import { Instructor_screeningRelationFilter } from "../inputs/Instructor_screeningRelationFilter";
import { IntFilter } from "../inputs/IntFilter";
import { IntNullableFilter } from "../inputs/IntNullableFilter";
import { Jufo_verification_transmissionRelationFilter } from "../inputs/Jufo_verification_transmissionRelationFilter";
import { LectureListRelationFilter } from "../inputs/LectureListRelationFilter";
import { MatchListRelationFilter } from "../inputs/MatchListRelationFilter";
import { Participation_certificateListRelationFilter } from "../inputs/Participation_certificateListRelationFilter";
import { Project_coaching_screeningRelationFilter } from "../inputs/Project_coaching_screeningRelationFilter";
import { Project_field_with_grade_restrictionListRelationFilter } from "../inputs/Project_field_with_grade_restrictionListRelationFilter";
import { Project_matchListRelationFilter } from "../inputs/Project_matchListRelationFilter";
import { Remission_requestRelationFilter } from "../inputs/Remission_requestRelationFilter";
import { ScreeningRelationFilter } from "../inputs/ScreeningRelationFilter";
import { StringFilter } from "../inputs/StringFilter";
import { StringNullableFilter } from "../inputs/StringNullableFilter";
import { Subcourse_instructors_studentListRelationFilter } from "../inputs/Subcourse_instructors_studentListRelationFilter";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class StudentWhereInput {
  @TypeGraphQL.Field(_type => [StudentWhereInput], {
    nullable: true
  })
  AND?: StudentWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [StudentWhereInput], {
    nullable: true
  })
  OR?: StudentWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [StudentWhereInput], {
    nullable: true
  })
  NOT?: StudentWhereInput[] | undefined;

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

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  phone?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  feedback?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => BoolFilter, {
    nullable: true
  })
  newsletter?: BoolFilter | undefined;

  @TypeGraphQL.Field(_type => BoolFilter, {
    nullable: true
  })
  isStudent?: BoolFilter | undefined;

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
  isCodu?: BoolFilter | undefined;

  @TypeGraphQL.Field(_type => BoolFilter, {
    nullable: true
  })
  isInstructor?: BoolFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  msg?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => Enumstudent_state_enumNullableFilter, {
    nullable: true
  })
  state?: Enumstudent_state_enumNullableFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  university?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => Enumstudent_module_enumNullableFilter, {
    nullable: true
  })
  module?: Enumstudent_module_enumNullableFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true
  })
  moduleHours?: IntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => BoolFilter, {
    nullable: true
  })
  isProjectCoach?: BoolFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  wasJufoParticipant?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => BoolNullableFilter, {
    nullable: true
  })
  hasJufoCertificate?: BoolNullableFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  jufoPastParticipationInfo?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => BoolNullableFilter, {
    nullable: true
  })
  jufoPastParticipationConfirmed?: BoolNullableFilter | undefined;

  @TypeGraphQL.Field(_type => BoolNullableFilter, {
    nullable: true
  })
  isUniversityStudent?: BoolNullableFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  openProjectMatchRequestCount?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  sentJufoAlumniScreeningReminderCount?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeNullableFilter, {
    nullable: true
  })
  lastSentJufoAlumniScreeningInvitationDate?: DateTimeNullableFilter | undefined;

  @TypeGraphQL.Field(_type => BoolNullableFilter, {
    nullable: true
  })
  supportsInDaZ?: BoolNullableFilter | undefined;

  @TypeGraphQL.Field(_type => Enumstudent_languages_enumNullableListFilter, {
    nullable: true
  })
  languages?: Enumstudent_languages_enumNullableListFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  sentScreeningReminderCount?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeNullableFilter, {
    nullable: true
  })
  lastSentScreeningInvitationDate?: DateTimeNullableFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  sentInstructorScreeningReminderCount?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeNullableFilter, {
    nullable: true
  })
  lastSentInstructorScreeningInvitationDate?: DateTimeNullableFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeNullableFilter, {
    nullable: true
  })
  lastUpdatedSettingsViaBlocker?: DateTimeNullableFilter | undefined;

  @TypeGraphQL.Field(_type => Enumstudent_registrationsource_enumFilter, {
    nullable: true
  })
  registrationSource?: Enumstudent_registrationsource_enumFilter | undefined;

  @TypeGraphQL.Field(_type => Certificate_of_conductRelationFilter, {
    nullable: true
  })
  certificate_of_conduct?: Certificate_of_conductRelationFilter | undefined;

  @TypeGraphQL.Field(_type => CourseListRelationFilter, {
    nullable: true
  })
  course?: CourseListRelationFilter | undefined;

  @TypeGraphQL.Field(_type => Course_guestListRelationFilter, {
    nullable: true
  })
  course_guest?: Course_guestListRelationFilter | undefined;

  @TypeGraphQL.Field(_type => Course_instructors_studentListRelationFilter, {
    nullable: true
  })
  course_instructors_student?: Course_instructors_studentListRelationFilter | undefined;

  @TypeGraphQL.Field(_type => Course_participation_certificateListRelationFilter, {
    nullable: true
  })
  course_participation_certificate?: Course_participation_certificateListRelationFilter | undefined;

  @TypeGraphQL.Field(_type => Expert_dataRelationFilter, {
    nullable: true
  })
  expert_data?: Expert_dataRelationFilter | undefined;

  @TypeGraphQL.Field(_type => Instructor_screeningRelationFilter, {
    nullable: true
  })
  instructor_screening?: Instructor_screeningRelationFilter | undefined;

  @TypeGraphQL.Field(_type => Jufo_verification_transmissionRelationFilter, {
    nullable: true
  })
  jufo_verification_transmission?: Jufo_verification_transmissionRelationFilter | undefined;

  @TypeGraphQL.Field(_type => LectureListRelationFilter, {
    nullable: true
  })
  lecture?: LectureListRelationFilter | undefined;

  @TypeGraphQL.Field(_type => MatchListRelationFilter, {
    nullable: true
  })
  match?: MatchListRelationFilter | undefined;

  @TypeGraphQL.Field(_type => Participation_certificateListRelationFilter, {
    nullable: true
  })
  participation_certificate?: Participation_certificateListRelationFilter | undefined;

  @TypeGraphQL.Field(_type => Project_coaching_screeningRelationFilter, {
    nullable: true
  })
  project_coaching_screening?: Project_coaching_screeningRelationFilter | undefined;

  @TypeGraphQL.Field(_type => Project_field_with_grade_restrictionListRelationFilter, {
    nullable: true
  })
  project_field_with_grade_restriction?: Project_field_with_grade_restrictionListRelationFilter | undefined;

  @TypeGraphQL.Field(_type => Project_matchListRelationFilter, {
    nullable: true
  })
  project_match?: Project_matchListRelationFilter | undefined;

  @TypeGraphQL.Field(_type => Remission_requestRelationFilter, {
    nullable: true
  })
  remission_request?: Remission_requestRelationFilter | undefined;

  @TypeGraphQL.Field(_type => ScreeningRelationFilter, {
    nullable: true
  })
  screening?: ScreeningRelationFilter | undefined;

  @TypeGraphQL.Field(_type => Subcourse_instructors_studentListRelationFilter, {
    nullable: true
  })
  subcourse_instructors_student?: Subcourse_instructors_studentListRelationFilter | undefined;
}
