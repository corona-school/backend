import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NotificationAvgAggregate } from "../outputs/NotificationAvgAggregate";
import { NotificationCountAggregate } from "../outputs/NotificationCountAggregate";
import { NotificationMaxAggregate } from "../outputs/NotificationMaxAggregate";
import { NotificationMinAggregate } from "../outputs/NotificationMinAggregate";
import { NotificationSumAggregate } from "../outputs/NotificationSumAggregate";

@TypeGraphQL.ObjectType("NotificationGroupBy", {
  isAbstract: true
})
export class NotificationGroupBy {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  id!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  mailjetTemplateId!: number | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  description!: string;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  active!: boolean;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  recipient!: number;

  @TypeGraphQL.Field(_type => [String], {
    nullable: true
  })
  onActions!: string[] | null;

  @TypeGraphQL.Field(_type => [String], {
    nullable: true
  })
  category!: string[] | null;

  @TypeGraphQL.Field(_type => [String], {
    nullable: true
  })
  cancelledOnAction!: string[] | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  delay!: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  interval!: number | null;

  @TypeGraphQL.Field(_type => NotificationCountAggregate, {
    nullable: true
  })
  _count!: NotificationCountAggregate | null;

  @TypeGraphQL.Field(_type => NotificationAvgAggregate, {
    nullable: true
  })
  _avg!: NotificationAvgAggregate | null;

  @TypeGraphQL.Field(_type => NotificationSumAggregate, {
    nullable: true
  })
  _sum!: NotificationSumAggregate | null;

  @TypeGraphQL.Field(_type => NotificationMinAggregate, {
    nullable: true
  })
  _min!: NotificationMinAggregate | null;

  @TypeGraphQL.Field(_type => NotificationMaxAggregate, {
    nullable: true
  })
  _max!: NotificationMaxAggregate | null;
}
