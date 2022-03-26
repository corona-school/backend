import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../scalars";
import { Course } from "../models/Course";
import { Course_participation_certificate } from "../models/Course_participation_certificate";
import { Lecture } from "../models/Lecture";
import { Subcourse_instructors_student } from "../models/Subcourse_instructors_student";
import { Subcourse_participants_pupil } from "../models/Subcourse_participants_pupil";
import { Subcourse_waiting_list_pupil } from "../models/Subcourse_waiting_list_pupil";
import { SubcourseCount } from "../resolvers/outputs/SubcourseCount";

@TypeGraphQL.ObjectType("Subcourse", {
  isAbstract: true
})
export class Subcourse {
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

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  minGrade!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  maxGrade!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  maxParticipants!: number;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  joinAfterStart!: boolean;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  published!: boolean;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  cancelled!: boolean;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  courseId?: number | null;

  course?: Course | null;

  course_participation_certificate?: Course_participation_certificate[];

  lecture?: Lecture[];

  subcourse_instructors_student?: Subcourse_instructors_student[];

  subcourse_participants_pupil?: Subcourse_participants_pupil[];

  subcourse_waiting_list_pupil?: Subcourse_waiting_list_pupil[];

  @TypeGraphQL.Field(_type => SubcourseCount, {
    nullable: true
  })
  _count?: SubcourseCount | null;
}
