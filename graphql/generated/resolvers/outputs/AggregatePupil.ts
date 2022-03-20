import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilAvgAggregate } from "../outputs/PupilAvgAggregate";
import { PupilCountAggregate } from "../outputs/PupilCountAggregate";
import { PupilMaxAggregate } from "../outputs/PupilMaxAggregate";
import { PupilMinAggregate } from "../outputs/PupilMinAggregate";
import { PupilSumAggregate } from "../outputs/PupilSumAggregate";

@TypeGraphQL.ObjectType("AggregatePupil", {
  isAbstract: true
})
export class AggregatePupil {
  @TypeGraphQL.Field(_type => PupilCountAggregate, {
    nullable: true
  })
  _count!: PupilCountAggregate | null;

  @TypeGraphQL.Field(_type => PupilAvgAggregate, {
    nullable: true
  })
  _avg!: PupilAvgAggregate | null;

  @TypeGraphQL.Field(_type => PupilSumAggregate, {
    nullable: true
  })
  _sum!: PupilSumAggregate | null;

  @TypeGraphQL.Field(_type => PupilMinAggregate, {
    nullable: true
  })
  _min!: PupilMinAggregate | null;

  @TypeGraphQL.Field(_type => PupilMaxAggregate, {
    nullable: true
  })
  _max!: PupilMaxAggregate | null;
}
