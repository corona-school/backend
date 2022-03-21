import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreeningAvgAggregate } from "../outputs/ScreeningAvgAggregate";
import { ScreeningCountAggregate } from "../outputs/ScreeningCountAggregate";
import { ScreeningMaxAggregate } from "../outputs/ScreeningMaxAggregate";
import { ScreeningMinAggregate } from "../outputs/ScreeningMinAggregate";
import { ScreeningSumAggregate } from "../outputs/ScreeningSumAggregate";

@TypeGraphQL.ObjectType("AggregateScreening", {
  isAbstract: true
})
export class AggregateScreening {
  @TypeGraphQL.Field(_type => ScreeningCountAggregate, {
    nullable: true
  })
  _count!: ScreeningCountAggregate | null;

  @TypeGraphQL.Field(_type => ScreeningAvgAggregate, {
    nullable: true
  })
  _avg!: ScreeningAvgAggregate | null;

  @TypeGraphQL.Field(_type => ScreeningSumAggregate, {
    nullable: true
  })
  _sum!: ScreeningSumAggregate | null;

  @TypeGraphQL.Field(_type => ScreeningMinAggregate, {
    nullable: true
  })
  _min!: ScreeningMinAggregate | null;

  @TypeGraphQL.Field(_type => ScreeningMaxAggregate, {
    nullable: true
  })
  _max!: ScreeningMaxAggregate | null;
}
