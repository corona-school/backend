import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_instructors_studentAvgAggregate } from "../outputs/Subcourse_instructors_studentAvgAggregate";
import { Subcourse_instructors_studentCountAggregate } from "../outputs/Subcourse_instructors_studentCountAggregate";
import { Subcourse_instructors_studentMaxAggregate } from "../outputs/Subcourse_instructors_studentMaxAggregate";
import { Subcourse_instructors_studentMinAggregate } from "../outputs/Subcourse_instructors_studentMinAggregate";
import { Subcourse_instructors_studentSumAggregate } from "../outputs/Subcourse_instructors_studentSumAggregate";

@TypeGraphQL.ObjectType("AggregateSubcourse_instructors_student", {
  isAbstract: true
})
export class AggregateSubcourse_instructors_student {
  @TypeGraphQL.Field(_type => Subcourse_instructors_studentCountAggregate, {
    nullable: true
  })
  _count!: Subcourse_instructors_studentCountAggregate | null;

  @TypeGraphQL.Field(_type => Subcourse_instructors_studentAvgAggregate, {
    nullable: true
  })
  _avg!: Subcourse_instructors_studentAvgAggregate | null;

  @TypeGraphQL.Field(_type => Subcourse_instructors_studentSumAggregate, {
    nullable: true
  })
  _sum!: Subcourse_instructors_studentSumAggregate | null;

  @TypeGraphQL.Field(_type => Subcourse_instructors_studentMinAggregate, {
    nullable: true
  })
  _min!: Subcourse_instructors_studentMinAggregate | null;

  @TypeGraphQL.Field(_type => Subcourse_instructors_studentMaxAggregate, {
    nullable: true
  })
  _max!: Subcourse_instructors_studentMaxAggregate | null;
}
