import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SchoolAvgAggregate } from "../outputs/SchoolAvgAggregate";
import { SchoolCountAggregate } from "../outputs/SchoolCountAggregate";
import { SchoolMaxAggregate } from "../outputs/SchoolMaxAggregate";
import { SchoolMinAggregate } from "../outputs/SchoolMinAggregate";
import { SchoolSumAggregate } from "../outputs/SchoolSumAggregate";

@TypeGraphQL.ObjectType("AggregateSchool", {
  isAbstract: true
})
export class AggregateSchool {
  @TypeGraphQL.Field(_type => SchoolCountAggregate, {
    nullable: true
  })
  _count!: SchoolCountAggregate | null;

  @TypeGraphQL.Field(_type => SchoolAvgAggregate, {
    nullable: true
  })
  _avg!: SchoolAvgAggregate | null;

  @TypeGraphQL.Field(_type => SchoolSumAggregate, {
    nullable: true
  })
  _sum!: SchoolSumAggregate | null;

  @TypeGraphQL.Field(_type => SchoolMinAggregate, {
    nullable: true
  })
  _min!: SchoolMinAggregate | null;

  @TypeGraphQL.Field(_type => SchoolMaxAggregate, {
    nullable: true
  })
  _max!: SchoolMaxAggregate | null;
}
