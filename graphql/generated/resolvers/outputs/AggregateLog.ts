import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { LogAvgAggregate } from "../outputs/LogAvgAggregate";
import { LogCountAggregate } from "../outputs/LogCountAggregate";
import { LogMaxAggregate } from "../outputs/LogMaxAggregate";
import { LogMinAggregate } from "../outputs/LogMinAggregate";
import { LogSumAggregate } from "../outputs/LogSumAggregate";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class AggregateLog {
  @TypeGraphQL.Field(_type => LogCountAggregate, {
    nullable: true
  })
  _count!: LogCountAggregate | null;

  @TypeGraphQL.Field(_type => LogAvgAggregate, {
    nullable: true
  })
  _avg!: LogAvgAggregate | null;

  @TypeGraphQL.Field(_type => LogSumAggregate, {
    nullable: true
  })
  _sum!: LogSumAggregate | null;

  @TypeGraphQL.Field(_type => LogMinAggregate, {
    nullable: true
  })
  _min!: LogMinAggregate | null;

  @TypeGraphQL.Field(_type => LogMaxAggregate, {
    nullable: true
  })
  _max!: LogMaxAggregate | null;
}
