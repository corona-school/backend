import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseOrderByWithRelationInput } from "../inputs/CourseOrderByWithRelationInput";
import { Course_participation_certificateOrderByRelationAggregateInput } from "../inputs/Course_participation_certificateOrderByRelationAggregateInput";
import { LectureOrderByRelationAggregateInput } from "../inputs/LectureOrderByRelationAggregateInput";
import { Subcourse_instructors_studentOrderByRelationAggregateInput } from "../inputs/Subcourse_instructors_studentOrderByRelationAggregateInput";
import { Subcourse_participants_pupilOrderByRelationAggregateInput } from "../inputs/Subcourse_participants_pupilOrderByRelationAggregateInput";
import { Subcourse_waiting_list_pupilOrderByRelationAggregateInput } from "../inputs/Subcourse_waiting_list_pupilOrderByRelationAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("SubcourseOrderByWithRelationInput", {
  isAbstract: true
})
export class SubcourseOrderByWithRelationInput {
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
  minGrade?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  maxGrade?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  maxParticipants?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  joinAfterStart?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  published?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  cancelled?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  courseId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => CourseOrderByWithRelationInput, {
    nullable: true
  })
  course?: CourseOrderByWithRelationInput | undefined;

  @TypeGraphQL.Field(_type => Course_participation_certificateOrderByRelationAggregateInput, {
    nullable: true
  })
  course_participation_certificate?: Course_participation_certificateOrderByRelationAggregateInput | undefined;

  @TypeGraphQL.Field(_type => LectureOrderByRelationAggregateInput, {
    nullable: true
  })
  lecture?: LectureOrderByRelationAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_instructors_studentOrderByRelationAggregateInput, {
    nullable: true
  })
  subcourse_instructors_student?: Subcourse_instructors_studentOrderByRelationAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_participants_pupilOrderByRelationAggregateInput, {
    nullable: true
  })
  subcourse_participants_pupil?: Subcourse_participants_pupilOrderByRelationAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilOrderByRelationAggregateInput, {
    nullable: true
  })
  subcourse_waiting_list_pupil?: Subcourse_waiting_list_pupilOrderByRelationAggregateInput | undefined;
}
