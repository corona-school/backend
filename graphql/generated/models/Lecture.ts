import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../scalars";
import { Course_attendance_log } from "../models/Course_attendance_log";
import { Student } from "../models/Student";
import { Subcourse } from "../models/Subcourse";
import { LectureCount } from "../resolvers/outputs/LectureCount";

@TypeGraphQL.ObjectType("Lecture", {
  isAbstract: true
})
export class Lecture {
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

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  start!: Date;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  duration!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  instructorId?: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  subcourseId?: number | null;

  student?: Student | null;

  subcourse?: Subcourse | null;

  course_attendance_log?: Course_attendance_log[];

  @TypeGraphQL.Field(_type => LectureCount, {
    nullable: true
  })
  _count?: LectureCount | null;
}
