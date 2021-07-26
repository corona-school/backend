import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreeningAvgAggregate } from "../outputs/ScreeningAvgAggregate";
import { ScreeningCountAggregate } from "../outputs/ScreeningCountAggregate";
import { ScreeningMaxAggregate } from "../outputs/ScreeningMaxAggregate";
import { ScreeningMinAggregate } from "../outputs/ScreeningMinAggregate";
import { ScreeningSumAggregate } from "../outputs/ScreeningSumAggregate";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class ScreeningGroupBy {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  id!: number;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  success!: boolean;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  comment!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  knowsCoronaSchoolFrom!: string | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  createdAt!: Date;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  updatedAt!: Date;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  screenerId!: number | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  studentId!: number | null;

  @TypeGraphQL.Field(_type => ScreeningCountAggregate, {
    nullable: true
  })
  _count!: ScreeningCountAggregate | null;

  @TypeGraphQL.Field(_type => ScreeningAvgAggregate, {
    nullable: true
  })
  _avg!: ScreeningAvgAggregate | null;

  @TypeGraphQL.Field(_type => ScreeningSumAggregate, {
    nullable: true
  })
  _sum!: ScreeningSumAggregate | null;

  @TypeGraphQL.Field(_type => ScreeningMinAggregate, {
    nullable: true
  })
  _min!: ScreeningMinAggregate | null;

  @TypeGraphQL.Field(_type => ScreeningMaxAggregate, {
    nullable: true
  })
  _max!: ScreeningMaxAggregate | null;
}
