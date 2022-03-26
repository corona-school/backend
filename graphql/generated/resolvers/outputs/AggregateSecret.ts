import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SecretAvgAggregate } from "../outputs/SecretAvgAggregate";
import { SecretCountAggregate } from "../outputs/SecretCountAggregate";
import { SecretMaxAggregate } from "../outputs/SecretMaxAggregate";
import { SecretMinAggregate } from "../outputs/SecretMinAggregate";
import { SecretSumAggregate } from "../outputs/SecretSumAggregate";

@TypeGraphQL.ObjectType("AggregateSecret", {
  isAbstract: true
})
export class AggregateSecret {
  @TypeGraphQL.Field(_type => SecretCountAggregate, {
    nullable: true
  })
  _count!: SecretCountAggregate | null;

  @TypeGraphQL.Field(_type => SecretAvgAggregate, {
    nullable: true
  })
  _avg!: SecretAvgAggregate | null;

  @TypeGraphQL.Field(_type => SecretSumAggregate, {
    nullable: true
  })
  _sum!: SecretSumAggregate | null;

  @TypeGraphQL.Field(_type => SecretMinAggregate, {
    nullable: true
  })
  _min!: SecretMinAggregate | null;

  @TypeGraphQL.Field(_type => SecretMaxAggregate, {
    nullable: true
  })
  _max!: SecretMaxAggregate | null;
}
