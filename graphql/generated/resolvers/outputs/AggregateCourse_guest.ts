import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_guestAvgAggregate } from "../outputs/Course_guestAvgAggregate";
import { Course_guestCountAggregate } from "../outputs/Course_guestCountAggregate";
import { Course_guestMaxAggregate } from "../outputs/Course_guestMaxAggregate";
import { Course_guestMinAggregate } from "../outputs/Course_guestMinAggregate";
import { Course_guestSumAggregate } from "../outputs/Course_guestSumAggregate";

@TypeGraphQL.ObjectType("AggregateCourse_guest", {
  isAbstract: true
})
export class AggregateCourse_guest {
  @TypeGraphQL.Field(_type => Course_guestCountAggregate, {
    nullable: true
  })
  _count!: Course_guestCountAggregate | null;

  @TypeGraphQL.Field(_type => Course_guestAvgAggregate, {
    nullable: true
  })
  _avg!: Course_guestAvgAggregate | null;

  @TypeGraphQL.Field(_type => Course_guestSumAggregate, {
    nullable: true
  })
  _sum!: Course_guestSumAggregate | null;

  @TypeGraphQL.Field(_type => Course_guestMinAggregate, {
    nullable: true
  })
  _min!: Course_guestMinAggregate | null;

  @TypeGraphQL.Field(_type => Course_guestMaxAggregate, {
    nullable: true
  })
  _max!: Course_guestMaxAggregate | null;
}
