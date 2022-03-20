import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Concrete_notificationAvgAggregate } from "../outputs/Concrete_notificationAvgAggregate";
import { Concrete_notificationCountAggregate } from "../outputs/Concrete_notificationCountAggregate";
import { Concrete_notificationMaxAggregate } from "../outputs/Concrete_notificationMaxAggregate";
import { Concrete_notificationMinAggregate } from "../outputs/Concrete_notificationMinAggregate";
import { Concrete_notificationSumAggregate } from "../outputs/Concrete_notificationSumAggregate";

@TypeGraphQL.ObjectType("AggregateConcrete_notification", {
  isAbstract: true
})
export class AggregateConcrete_notification {
  @TypeGraphQL.Field(_type => Concrete_notificationCountAggregate, {
    nullable: true
  })
  _count!: Concrete_notificationCountAggregate | null;

  @TypeGraphQL.Field(_type => Concrete_notificationAvgAggregate, {
    nullable: true
  })
  _avg!: Concrete_notificationAvgAggregate | null;

  @TypeGraphQL.Field(_type => Concrete_notificationSumAggregate, {
    nullable: true
  })
  _sum!: Concrete_notificationSumAggregate | null;

  @TypeGraphQL.Field(_type => Concrete_notificationMinAggregate, {
    nullable: true
  })
  _min!: Concrete_notificationMinAggregate | null;

  @TypeGraphQL.Field(_type => Concrete_notificationMaxAggregate, {
    nullable: true
  })
  _max!: Concrete_notificationMaxAggregate | null;
}
