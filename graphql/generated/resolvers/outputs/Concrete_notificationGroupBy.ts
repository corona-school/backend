import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Concrete_notificationAvgAggregate } from "../outputs/Concrete_notificationAvgAggregate";
import { Concrete_notificationCountAggregate } from "../outputs/Concrete_notificationCountAggregate";
import { Concrete_notificationMaxAggregate } from "../outputs/Concrete_notificationMaxAggregate";
import { Concrete_notificationMinAggregate } from "../outputs/Concrete_notificationMinAggregate";
import { Concrete_notificationSumAggregate } from "../outputs/Concrete_notificationSumAggregate";

@TypeGraphQL.ObjectType("Concrete_notificationGroupBy", {
  isAbstract: true
})
export class Concrete_notificationGroupBy {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  id!: number;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  userId!: string;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  notificationID!: number;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  contextID!: string | null;

  @TypeGraphQL.Field(_type => GraphQLScalars.JSONResolver, {
    nullable: false
  })
  context!: Prisma.JsonValue;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  sentAt!: Date;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  state!: number;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  error!: string | null;

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
