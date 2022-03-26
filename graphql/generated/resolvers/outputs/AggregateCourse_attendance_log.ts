import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_attendance_logAvgAggregate } from "../outputs/Course_attendance_logAvgAggregate";
import { Course_attendance_logCountAggregate } from "../outputs/Course_attendance_logCountAggregate";
import { Course_attendance_logMaxAggregate } from "../outputs/Course_attendance_logMaxAggregate";
import { Course_attendance_logMinAggregate } from "../outputs/Course_attendance_logMinAggregate";
import { Course_attendance_logSumAggregate } from "../outputs/Course_attendance_logSumAggregate";

@TypeGraphQL.ObjectType("AggregateCourse_attendance_log", {
  isAbstract: true
})
export class AggregateCourse_attendance_log {
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
