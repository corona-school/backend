import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Certificate_of_conductOrderByWithRelationInput } from "../inputs/Certificate_of_conductOrderByWithRelationInput";
import { CourseOrderByRelationAggregateInput } from "../inputs/CourseOrderByRelationAggregateInput";
import { Course_guestOrderByRelationAggregateInput } from "../inputs/Course_guestOrderByRelationAggregateInput";
import { Course_instructors_studentOrderByRelationAggregateInput } from "../inputs/Course_instructors_studentOrderByRelationAggregateInput";
import { Course_participation_certificateOrderByRelationAggregateInput } from "../inputs/Course_participation_certificateOrderByRelationAggregateInput";
import { Expert_dataOrderByWithRelationInput } from "../inputs/Expert_dataOrderByWithRelationInput";
import { Instructor_screeningOrderByWithRelationInput } from "../inputs/Instructor_screeningOrderByWithRelationInput";
import { Jufo_verification_transmissionOrderByWithRelationInput } from "../inputs/Jufo_verification_transmissionOrderByWithRelationInput";
import { LectureOrderByRelationAggregateInput } from "../inputs/LectureOrderByRelationAggregateInput";
import { MatchOrderByRelationAggregateInput } from "../inputs/MatchOrderByRelationAggregateInput";
import { Participation_certificateOrderByRelationAggregateInput } from "../inputs/Participation_certificateOrderByRelationAggregateInput";
import { Project_coaching_screeningOrderByWithRelationInput } from "../inputs/Project_coaching_screeningOrderByWithRelationInput";
import { Project_field_with_grade_restrictionOrderByRelationAggregateInput } from "../inputs/Project_field_with_grade_restrictionOrderByRelationAggregateInput";
import { Project_matchOrderByRelationAggregateInput } from "../inputs/Project_matchOrderByRelationAggregateInput";
import { Remission_requestOrderByWithRelationInput } from "../inputs/Remission_requestOrderByWithRelationInput";
import { ScreeningOrderByWithRelationInput } from "../inputs/ScreeningOrderByWithRelationInput";
import { Subcourse_instructors_studentOrderByRelationAggregateInput } from "../inputs/Subcourse_instructors_studentOrderByRelationAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("StudentOrderByWithRelationInput", {
  isAbstract: true
})
export class StudentOrderByWithRelationInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  id?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  createdAt?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  updatedAt?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  firstname?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  lastname?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  active?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  email?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  verification?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  verifiedAt?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  authToken?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  authTokenUsed?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  authTokenSent?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  wix_id?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  wix_creation_date?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  phone?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  feedback?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  newsletter?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  isStudent?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  subjects?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  openMatchRequestCount?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  isCodu?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  isInstructor?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  msg?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  state?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  university?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  module?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  moduleHours?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  isProjectCoach?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  wasJufoParticipant?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  hasJufoCertificate?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  jufoPastParticipationInfo?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  jufoPastParticipationConfirmed?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  isUniversityStudent?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  openProjectMatchRequestCount?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  sentJufoAlumniScreeningReminderCount?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  lastSentJufoAlumniScreeningInvitationDate?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  supportsInDaZ?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  languages?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  sentScreeningReminderCount?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  lastSentScreeningInvitationDate?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  sentInstructorScreeningReminderCount?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  lastSentInstructorScreeningInvitationDate?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  lastUpdatedSettingsViaBlocker?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  registrationSource?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => Certificate_of_conductOrderByWithRelationInput, {
    nullable: true
  })
  certificate_of_conduct?: Certificate_of_conductOrderByWithRelationInput | undefined;

  @TypeGraphQL.Field(_type => CourseOrderByRelationAggregateInput, {
    nullable: true
  })
  course?: CourseOrderByRelationAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Course_guestOrderByRelationAggregateInput, {
    nullable: true
  })
  course_guest?: Course_guestOrderByRelationAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Course_instructors_studentOrderByRelationAggregateInput, {
    nullable: true
  })
  course_instructors_student?: Course_instructors_studentOrderByRelationAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Course_participation_certificateOrderByRelationAggregateInput, {
    nullable: true
  })
  course_participation_certificate?: Course_participation_certificateOrderByRelationAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Expert_dataOrderByWithRelationInput, {
    nullable: true
  })
  expert_data?: Expert_dataOrderByWithRelationInput | undefined;

  @TypeGraphQL.Field(_type => Instructor_screeningOrderByWithRelationInput, {
    nullable: true
  })
  instructor_screening?: Instructor_screeningOrderByWithRelationInput | undefined;

  @TypeGraphQL.Field(_type => Jufo_verification_transmissionOrderByWithRelationInput, {
    nullable: true
  })
  jufo_verification_transmission?: Jufo_verification_transmissionOrderByWithRelationInput | undefined;

  @TypeGraphQL.Field(_type => LectureOrderByRelationAggregateInput, {
    nullable: true
  })
  lecture?: LectureOrderByRelationAggregateInput | undefined;

  @TypeGraphQL.Field(_type => MatchOrderByRelationAggregateInput, {
    nullable: true
  })
  match?: MatchOrderByRelationAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Participation_certificateOrderByRelationAggregateInput, {
    nullable: true
  })
  participation_certificate?: Participation_certificateOrderByRelationAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Project_coaching_screeningOrderByWithRelationInput, {
    nullable: true
  })
  project_coaching_screening?: Project_coaching_screeningOrderByWithRelationInput | undefined;

  @TypeGraphQL.Field(_type => Project_field_with_grade_restrictionOrderByRelationAggregateInput, {
    nullable: true
  })
  project_field_with_grade_restriction?: Project_field_with_grade_restrictionOrderByRelationAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Project_matchOrderByRelationAggregateInput, {
    nullable: true
  })
  project_match?: Project_matchOrderByRelationAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Remission_requestOrderByWithRelationInput, {
    nullable: true
  })
  remission_request?: Remission_requestOrderByWithRelationInput | undefined;

  @TypeGraphQL.Field(_type => ScreeningOrderByWithRelationInput, {
    nullable: true
  })
  screening?: ScreeningOrderByWithRelationInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_instructors_studentOrderByRelationAggregateInput, {
    nullable: true
  })
  subcourse_instructors_student?: Subcourse_instructors_studentOrderByRelationAggregateInput | undefined;
}
