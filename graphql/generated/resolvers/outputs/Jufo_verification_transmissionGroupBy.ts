import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Jufo_verification_transmissionAvgAggregate } from "../outputs/Jufo_verification_transmissionAvgAggregate";
import { Jufo_verification_transmissionCountAggregate } from "../outputs/Jufo_verification_transmissionCountAggregate";
import { Jufo_verification_transmissionMaxAggregate } from "../outputs/Jufo_verification_transmissionMaxAggregate";
import { Jufo_verification_transmissionMinAggregate } from "../outputs/Jufo_verification_transmissionMinAggregate";
import { Jufo_verification_transmissionSumAggregate } from "../outputs/Jufo_verification_transmissionSumAggregate";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class Jufo_verification_transmissionGroupBy {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  id!: number;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  createdAt!: Date;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  uuid!: string;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  studentId!: number | null;

  @TypeGraphQL.Field(_type => Jufo_verification_transmissionCountAggregate, {
    nullable: true
  })
  _count!: Jufo_verification_transmissionCountAggregate | null;

  @TypeGraphQL.Field(_type => Jufo_verification_transmissionAvgAggregate, {
    nullable: true
  })
  _avg!: Jufo_verification_transmissionAvgAggregate | null;

  @TypeGraphQL.Field(_type => Jufo_verification_transmissionSumAggregate, {
    nullable: true
  })
  _sum!: Jufo_verification_transmissionSumAggregate | null;

  @TypeGraphQL.Field(_type => Jufo_verification_transmissionMinAggregate, {
    nullable: true
  })
  _min!: Jufo_verification_transmissionMinAggregate | null;

  @TypeGraphQL.Field(_type => Jufo_verification_transmissionMaxAggregate, {
    nullable: true
  })
  _max!: Jufo_verification_transmissionMaxAggregate | null;
}
