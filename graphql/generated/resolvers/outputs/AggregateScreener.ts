import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreenerAvgAggregate } from "../outputs/ScreenerAvgAggregate";
import { ScreenerCountAggregate } from "../outputs/ScreenerCountAggregate";
import { ScreenerMaxAggregate } from "../outputs/ScreenerMaxAggregate";
import { ScreenerMinAggregate } from "../outputs/ScreenerMinAggregate";
import { ScreenerSumAggregate } from "../outputs/ScreenerSumAggregate";

@TypeGraphQL.ObjectType("AggregateScreener", {
  isAbstract: true
})
export class AggregateScreener {
  @TypeGraphQL.Field(_type => ScreenerCountAggregate, {
    nullable: true
  })
  _count!: ScreenerCountAggregate | null;

  @TypeGraphQL.Field(_type => ScreenerAvgAggregate, {
    nullable: true
  })
  _avg!: ScreenerAvgAggregate | null;

  @TypeGraphQL.Field(_type => ScreenerSumAggregate, {
    nullable: true
  })
  _sum!: ScreenerSumAggregate | null;

  @TypeGraphQL.Field(_type => ScreenerMinAggregate, {
    nullable: true
  })
  _min!: ScreenerMinAggregate | null;

  @TypeGraphQL.Field(_type => ScreenerMaxAggregate, {
    nullable: true
  })
  _max!: ScreenerMaxAggregate | null;
}
