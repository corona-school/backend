import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Remission_requestAvgAggregate } from "../outputs/Remission_requestAvgAggregate";
import { Remission_requestCountAggregate } from "../outputs/Remission_requestCountAggregate";
import { Remission_requestMaxAggregate } from "../outputs/Remission_requestMaxAggregate";
import { Remission_requestMinAggregate } from "../outputs/Remission_requestMinAggregate";
import { Remission_requestSumAggregate } from "../outputs/Remission_requestSumAggregate";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class AggregateRemission_request {
  @TypeGraphQL.Field(_type => Remission_requestCountAggregate, {
    nullable: true
  })
  _count!: Remission_requestCountAggregate | null;

  @TypeGraphQL.Field(_type => Remission_requestAvgAggregate, {
    nullable: true
  })
  _avg!: Remission_requestAvgAggregate | null;

  @TypeGraphQL.Field(_type => Remission_requestSumAggregate, {
    nullable: true
  })
  _sum!: Remission_requestSumAggregate | null;

  @TypeGraphQL.Field(_type => Remission_requestMinAggregate, {
    nullable: true
  })
  _min!: Remission_requestMinAggregate | null;

  @TypeGraphQL.Field(_type => Remission_requestMaxAggregate, {
    nullable: true
  })
  _max!: Remission_requestMaxAggregate | null;
}
