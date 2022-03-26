import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_tags_course_tagAvgAggregate } from "../outputs/Course_tags_course_tagAvgAggregate";
import { Course_tags_course_tagCountAggregate } from "../outputs/Course_tags_course_tagCountAggregate";
import { Course_tags_course_tagMaxAggregate } from "../outputs/Course_tags_course_tagMaxAggregate";
import { Course_tags_course_tagMinAggregate } from "../outputs/Course_tags_course_tagMinAggregate";
import { Course_tags_course_tagSumAggregate } from "../outputs/Course_tags_course_tagSumAggregate";

@TypeGraphQL.ObjectType("Course_tags_course_tagGroupBy", {
  isAbstract: true
})
export class Course_tags_course_tagGroupBy {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  courseId!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  courseTagId!: number;

  @TypeGraphQL.Field(_type => Course_tags_course_tagCountAggregate, {
    nullable: true
  })
  _count!: Course_tags_course_tagCountAggregate | null;

  @TypeGraphQL.Field(_type => Course_tags_course_tagAvgAggregate, {
    nullable: true
  })
  _avg!: Course_tags_course_tagAvgAggregate | null;

  @TypeGraphQL.Field(_type => Course_tags_course_tagSumAggregate, {
    nullable: true
  })
  _sum!: Course_tags_course_tagSumAggregate | null;

  @TypeGraphQL.Field(_type => Course_tags_course_tagMinAggregate, {
    nullable: true
  })
  _min!: Course_tags_course_tagMinAggregate | null;

  @TypeGraphQL.Field(_type => Course_tags_course_tagMaxAggregate, {
    nullable: true
  })
  _max!: Course_tags_course_tagMaxAggregate | null;
}
