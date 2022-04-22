import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_waiting_list_pupilAvgAggregate } from "../outputs/Subcourse_waiting_list_pupilAvgAggregate";
import { Subcourse_waiting_list_pupilCountAggregate } from "../outputs/Subcourse_waiting_list_pupilCountAggregate";
import { Subcourse_waiting_list_pupilMaxAggregate } from "../outputs/Subcourse_waiting_list_pupilMaxAggregate";
import { Subcourse_waiting_list_pupilMinAggregate } from "../outputs/Subcourse_waiting_list_pupilMinAggregate";
import { Subcourse_waiting_list_pupilSumAggregate } from "../outputs/Subcourse_waiting_list_pupilSumAggregate";

@TypeGraphQL.ObjectType("AggregateSubcourse_waiting_list_pupil", {
  isAbstract: true
})
export class AggregateSubcourse_waiting_list_pupil {
  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilCountAggregate, {
    nullable: true
  })
  _count!: Subcourse_waiting_list_pupilCountAggregate | null;

  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilAvgAggregate, {
    nullable: true
  })
  _avg!: Subcourse_waiting_list_pupilAvgAggregate | null;

  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilSumAggregate, {
    nullable: true
  })
  _sum!: Subcourse_waiting_list_pupilSumAggregate | null;

  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilMinAggregate, {
    nullable: true
  })
  _min!: Subcourse_waiting_list_pupilMinAggregate | null;

  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilMaxAggregate, {
    nullable: true
  })
  _max!: Subcourse_waiting_list_pupilMaxAggregate | null;
}
