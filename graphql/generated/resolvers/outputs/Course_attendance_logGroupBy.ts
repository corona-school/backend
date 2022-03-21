import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_attendance_logAvgAggregate } from "../outputs/Course_attendance_logAvgAggregate";
import { Course_attendance_logCountAggregate } from "../outputs/Course_attendance_logCountAggregate";
import { Course_attendance_logMaxAggregate } from "../outputs/Course_attendance_logMaxAggregate";
import { Course_attendance_logMinAggregate } from "../outputs/Course_attendance_logMinAggregate";
import { Course_attendance_logSumAggregate } from "../outputs/Course_attendance_logSumAggregate";

@TypeGraphQL.ObjectType("Course_attendance_logGroupBy", {
  isAbstract: true
})
export class Course_attendance_logGroupBy {
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
    nullable: true
  })
  attendedTime!: number | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  ip!: string | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  pupilId!: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  lectureId!: number | null;

  @TypeGraphQL.Field(_type => Course_attendance_logCountAggregate, {
    nullable: true
  })
  _count!: Course_attendance_logCountAggregate | null;

  @TypeGraphQL.Field(_type => Course_attendance_logAvgAggregate, {
    nullable: true
  })
  _avg!: Course_attendance_logAvgAggregate | null;

  @TypeGraphQL.Field(_type => Course_attendance_logSumAggregate, {
    nullable: true
  })
  _sum!: Course_attendance_logSumAggregate | null;

  @TypeGraphQL.Field(_type => Course_attendance_logMinAggregate, {
    nullable: true
  })
  _min!: Course_attendance_logMinAggregate | null;

  @TypeGraphQL.Field(_type => Course_attendance_logMaxAggregate, {
    nullable: true
  })
  _max!: Course_attendance_logMaxAggregate | null;
}
