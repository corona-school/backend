import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseAvgAggregate } from "../outputs/CourseAvgAggregate";
import { CourseCountAggregate } from "../outputs/CourseCountAggregate";
import { CourseMaxAggregate } from "../outputs/CourseMaxAggregate";
import { CourseMinAggregate } from "../outputs/CourseMinAggregate";
import { CourseSumAggregate } from "../outputs/CourseSumAggregate";

@TypeGraphQL.ObjectType("AggregateCourse", {
  isAbstract: true
})
export class AggregateCourse {
  @TypeGraphQL.Field(_type => CourseCountAggregate, {
    nullable: true
  })
  _count!: CourseCountAggregate | null;

  @TypeGraphQL.Field(_type => CourseAvgAggregate, {
    nullable: true
  })
  _avg!: CourseAvgAggregate | null;

  @TypeGraphQL.Field(_type => CourseSumAggregate, {
    nullable: true
  })
  _sum!: CourseSumAggregate | null;

  @TypeGraphQL.Field(_type => CourseMinAggregate, {
    nullable: true
  })
  _min!: CourseMinAggregate | null;

  @TypeGraphQL.Field(_type => CourseMaxAggregate, {
    nullable: true
  })
  _max!: CourseMaxAggregate | null;
}
