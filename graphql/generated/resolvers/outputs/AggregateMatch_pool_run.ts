import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Match_pool_runAvgAggregate } from "../outputs/Match_pool_runAvgAggregate";
import { Match_pool_runCountAggregate } from "../outputs/Match_pool_runCountAggregate";
import { Match_pool_runMaxAggregate } from "../outputs/Match_pool_runMaxAggregate";
import { Match_pool_runMinAggregate } from "../outputs/Match_pool_runMinAggregate";
import { Match_pool_runSumAggregate } from "../outputs/Match_pool_runSumAggregate";

@TypeGraphQL.ObjectType("AggregateMatch_pool_run", {
  isAbstract: true
})
export class AggregateMatch_pool_run {
  @TypeGraphQL.Field(_type => Match_pool_runCountAggregate, {
    nullable: true
  })
  _count!: Match_pool_runCountAggregate | null;

  @TypeGraphQL.Field(_type => Match_pool_runAvgAggregate, {
    nullable: true
  })
  _avg!: Match_pool_runAvgAggregate | null;

  @TypeGraphQL.Field(_type => Match_pool_runSumAggregate, {
    nullable: true
  })
  _sum!: Match_pool_runSumAggregate | null;

  @TypeGraphQL.Field(_type => Match_pool_runMinAggregate, {
    nullable: true
  })
  _min!: Match_pool_runMinAggregate | null;

  @TypeGraphQL.Field(_type => Match_pool_runMaxAggregate, {
    nullable: true
  })
  _max!: Match_pool_runMaxAggregate | null;
}
