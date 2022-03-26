import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { MatchAvgAggregate } from "../outputs/MatchAvgAggregate";
import { MatchCountAggregate } from "../outputs/MatchCountAggregate";
import { MatchMaxAggregate } from "../outputs/MatchMaxAggregate";
import { MatchMinAggregate } from "../outputs/MatchMinAggregate";
import { MatchSumAggregate } from "../outputs/MatchSumAggregate";

@TypeGraphQL.ObjectType("AggregateMatch", {
  isAbstract: true
})
export class AggregateMatch {
  @TypeGraphQL.Field(_type => MatchCountAggregate, {
    nullable: true
  })
  _count!: MatchCountAggregate | null;

  @TypeGraphQL.Field(_type => MatchAvgAggregate, {
    nullable: true
  })
  _avg!: MatchAvgAggregate | null;

  @TypeGraphQL.Field(_type => MatchSumAggregate, {
    nullable: true
  })
  _sum!: MatchSumAggregate | null;

  @TypeGraphQL.Field(_type => MatchMinAggregate, {
    nullable: true
  })
  _min!: MatchMinAggregate | null;

  @TypeGraphQL.Field(_type => MatchMaxAggregate, {
    nullable: true
  })
  _max!: MatchMaxAggregate | null;
}
