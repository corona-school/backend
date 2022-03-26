import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreenerAvgAggregate } from "../outputs/ScreenerAvgAggregate";
import { ScreenerCountAggregate } from "../outputs/ScreenerCountAggregate";
import { ScreenerMaxAggregate } from "../outputs/ScreenerMaxAggregate";
import { ScreenerMinAggregate } from "../outputs/ScreenerMinAggregate";
import { ScreenerSumAggregate } from "../outputs/ScreenerSumAggregate";

@TypeGraphQL.ObjectType("ScreenerGroupBy", {
  isAbstract: true
})
export class ScreenerGroupBy {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  id!: number;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  createdAt!: Date;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  updatedAt!: Date;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  firstname!: string | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  lastname!: string | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  active!: boolean;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  email!: string;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  verification!: string | null;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  verifiedAt!: Date | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  authToken!: string | null;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  authTokenUsed!: boolean;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  authTokenSent!: Date | null;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  password!: string;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  verified!: boolean | null;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  oldNumberID!: number | null;

  @TypeGraphQL.Field(_type => ScreenerCountAggregate, {
    nullable: true
  })
  _count!: ScreenerCountAggregate | null;

  @TypeGraphQL.Field(_type => ScreenerAvgAggregate, {
    nullable: true
  })
  _avg!: ScreenerAvgAggregate | null;

  @TypeGraphQL.Field(_type => ScreenerSumAggregate, {
    nullable: true
  })
  _sum!: ScreenerSumAggregate | null;

  @TypeGraphQL.Field(_type => ScreenerMinAggregate, {
    nullable: true
  })
  _min!: ScreenerMinAggregate | null;

  @TypeGraphQL.Field(_type => ScreenerMaxAggregate, {
    nullable: true
  })
  _max!: ScreenerMaxAggregate | null;
}
