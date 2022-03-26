import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_instructors_studentAvgAggregate } from "../outputs/Course_instructors_studentAvgAggregate";
import { Course_instructors_studentCountAggregate } from "../outputs/Course_instructors_studentCountAggregate";
import { Course_instructors_studentMaxAggregate } from "../outputs/Course_instructors_studentMaxAggregate";
import { Course_instructors_studentMinAggregate } from "../outputs/Course_instructors_studentMinAggregate";
import { Course_instructors_studentSumAggregate } from "../outputs/Course_instructors_studentSumAggregate";

@TypeGraphQL.ObjectType("Course_instructors_studentGroupBy", {
  isAbstract: true
})
export class Course_instructors_studentGroupBy {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  courseId!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  studentId!: number;

  @TypeGraphQL.Field(_type => Course_instructors_studentCountAggregate, {
    nullable: true
  })
  _count!: Course_instructors_studentCountAggregate | null;

  @TypeGraphQL.Field(_type => Course_instructors_studentAvgAggregate, {
    nullable: true
  })
  _avg!: Course_instructors_studentAvgAggregate | null;

  @TypeGraphQL.Field(_type => Course_instructors_studentSumAggregate, {
    nullable: true
  })
  _sum!: Course_instructors_studentSumAggregate | null;

  @TypeGraphQL.Field(_type => Course_instructors_studentMinAggregate, {
    nullable: true
  })
  _min!: Course_instructors_studentMinAggregate | null;

  @TypeGraphQL.Field(_type => Course_instructors_studentMaxAggregate, {
    nullable: true
  })
  _max!: Course_instructors_studentMaxAggregate | null;
}
