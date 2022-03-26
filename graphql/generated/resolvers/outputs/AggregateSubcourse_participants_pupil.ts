import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_participants_pupilAvgAggregate } from "../outputs/Subcourse_participants_pupilAvgAggregate";
import { Subcourse_participants_pupilCountAggregate } from "../outputs/Subcourse_participants_pupilCountAggregate";
import { Subcourse_participants_pupilMaxAggregate } from "../outputs/Subcourse_participants_pupilMaxAggregate";
import { Subcourse_participants_pupilMinAggregate } from "../outputs/Subcourse_participants_pupilMinAggregate";
import { Subcourse_participants_pupilSumAggregate } from "../outputs/Subcourse_participants_pupilSumAggregate";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class AggregateSubcourse_participants_pupil {
  @TypeGraphQL.Field(_type => Subcourse_participants_pupilCountAggregate, {
    nullable: true
  })
  _count!: Subcourse_participants_pupilCountAggregate | null;

  @TypeGraphQL.Field(_type => Subcourse_participants_pupilAvgAggregate, {
    nullable: true
  })
  _avg!: Subcourse_participants_pupilAvgAggregate | null;

  @TypeGraphQL.Field(_type => Subcourse_participants_pupilSumAggregate, {
    nullable: true
  })
  _sum!: Subcourse_participants_pupilSumAggregate | null;

  @TypeGraphQL.Field(_type => Subcourse_participants_pupilMinAggregate, {
    nullable: true
  })
  _min!: Subcourse_participants_pupilMinAggregate | null;

  @TypeGraphQL.Field(_type => Subcourse_participants_pupilMaxAggregate, {
    nullable: true
  })
  _max!: Subcourse_participants_pupilMaxAggregate | null;
}
