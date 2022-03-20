import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BoolFilter } from "../inputs/BoolFilter";
import { CourseRelationFilter } from "../inputs/CourseRelationFilter";
import { Course_participation_certificateListRelationFilter } from "../inputs/Course_participation_certificateListRelationFilter";
import { DateTimeFilter } from "../inputs/DateTimeFilter";
import { IntFilter } from "../inputs/IntFilter";
import { IntNullableFilter } from "../inputs/IntNullableFilter";
import { LectureListRelationFilter } from "../inputs/LectureListRelationFilter";
import { Subcourse_instructors_studentListRelationFilter } from "../inputs/Subcourse_instructors_studentListRelationFilter";
import { Subcourse_participants_pupilListRelationFilter } from "../inputs/Subcourse_participants_pupilListRelationFilter";
import { Subcourse_waiting_list_pupilListRelationFilter } from "../inputs/Subcourse_waiting_list_pupilListRelationFilter";

@TypeGraphQL.InputType("SubcourseWhereInput", {
  isAbstract: true
})
export class SubcourseWhereInput {
  @TypeGraphQL.Field(_type => [SubcourseWhereInput], {
    nullable: true
  })
  AND?: SubcourseWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [SubcourseWhereInput], {
    nullable: true
  })
  OR?: SubcourseWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [SubcourseWhereInput], {
    nullable: true
  })
  NOT?: SubcourseWhereInput[] | undefined;

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

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  minGrade?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  maxGrade?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  maxParticipants?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => BoolFilter, {
    nullable: true
  })
  joinAfterStart?: BoolFilter | undefined;

  @TypeGraphQL.Field(_type => BoolFilter, {
    nullable: true
  })
  published?: BoolFilter | undefined;

  @TypeGraphQL.Field(_type => BoolFilter, {
    nullable: true
  })
  cancelled?: BoolFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true
  })
  courseId?: IntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => CourseRelationFilter, {
    nullable: true
  })
  course?: CourseRelationFilter | undefined;

  @TypeGraphQL.Field(_type => Course_participation_certificateListRelationFilter, {
    nullable: true
  })
  course_participation_certificate?: Course_participation_certificateListRelationFilter | undefined;

  @TypeGraphQL.Field(_type => LectureListRelationFilter, {
    nullable: true
  })
  lecture?: LectureListRelationFilter | undefined;

  @TypeGraphQL.Field(_type => Subcourse_instructors_studentListRelationFilter, {
    nullable: true
  })
  subcourse_instructors_student?: Subcourse_instructors_studentListRelationFilter | undefined;

  @TypeGraphQL.Field(_type => Subcourse_participants_pupilListRelationFilter, {
    nullable: true
  })
  subcourse_participants_pupil?: Subcourse_participants_pupilListRelationFilter | undefined;

  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilListRelationFilter, {
    nullable: true
  })
  subcourse_waiting_list_pupil?: Subcourse_waiting_list_pupilListRelationFilter | undefined;
}
