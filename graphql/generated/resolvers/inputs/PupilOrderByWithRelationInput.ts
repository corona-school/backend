import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_attendance_logOrderByRelationAggregateInput } from "../inputs/Course_attendance_logOrderByRelationAggregateInput";
import { Course_participation_certificateOrderByRelationAggregateInput } from "../inputs/Course_participation_certificateOrderByRelationAggregateInput";
import { MatchOrderByRelationAggregateInput } from "../inputs/MatchOrderByRelationAggregateInput";
import { Participation_certificateOrderByRelationAggregateInput } from "../inputs/Participation_certificateOrderByRelationAggregateInput";
import { Project_matchOrderByRelationAggregateInput } from "../inputs/Project_matchOrderByRelationAggregateInput";
import { Pupil_tutoring_interest_confirmation_requestOrderByWithRelationInput } from "../inputs/Pupil_tutoring_interest_confirmation_requestOrderByWithRelationInput";
import { SchoolOrderByWithRelationInput } from "../inputs/SchoolOrderByWithRelationInput";
import { Subcourse_participants_pupilOrderByRelationAggregateInput } from "../inputs/Subcourse_participants_pupilOrderByRelationAggregateInput";
import { Subcourse_waiting_list_pupilOrderByRelationAggregateInput } from "../inputs/Subcourse_waiting_list_pupilOrderByRelationAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("PupilOrderByWithRelationInput", {
  isAbstract: true
})
export class PupilOrderByWithRelationInput {
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
  state?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  schooltype?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  msg?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  grade?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  newsletter?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  isPupil?: "asc" | "desc" | undefined;

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
  isParticipant?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  isProjectCoachee?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  projectFields?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  isJufoParticipant?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  openProjectMatchRequestCount?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  projectMemberCount?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  languages?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  learningGermanSince?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  matchingPriority?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  lastUpdatedSettingsViaBlocker?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  teacherEmailAddress?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  registrationSource?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  coduToken?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  schoolId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SchoolOrderByWithRelationInput, {
    nullable: true
  })
  school?: SchoolOrderByWithRelationInput | undefined;

  @TypeGraphQL.Field(_type => Course_attendance_logOrderByRelationAggregateInput, {
    nullable: true
  })
  course_attendance_log?: Course_attendance_logOrderByRelationAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Course_participation_certificateOrderByRelationAggregateInput, {
    nullable: true
  })
  course_participation_certificate?: Course_participation_certificateOrderByRelationAggregateInput | undefined;

  @TypeGraphQL.Field(_type => MatchOrderByRelationAggregateInput, {
    nullable: true
  })
  match?: MatchOrderByRelationAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Participation_certificateOrderByRelationAggregateInput, {
    nullable: true
  })
  participation_certificate?: Participation_certificateOrderByRelationAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Project_matchOrderByRelationAggregateInput, {
    nullable: true
  })
  project_match?: Project_matchOrderByRelationAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestOrderByWithRelationInput, {
    nullable: true
  })
  pupil_tutoring_interest_confirmation_request?: Pupil_tutoring_interest_confirmation_requestOrderByWithRelationInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_participants_pupilOrderByRelationAggregateInput, {
    nullable: true
  })
  subcourse_participants_pupil?: Subcourse_participants_pupilOrderByRelationAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilOrderByRelationAggregateInput, {
    nullable: true
  })
  subcourse_waiting_list_pupil?: Subcourse_waiting_list_pupilOrderByRelationAggregateInput | undefined;
}
