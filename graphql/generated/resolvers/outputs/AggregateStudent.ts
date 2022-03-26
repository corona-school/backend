import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentAvgAggregate } from "../outputs/StudentAvgAggregate";
import { StudentCountAggregate } from "../outputs/StudentCountAggregate";
import { StudentMaxAggregate } from "../outputs/StudentMaxAggregate";
import { StudentMinAggregate } from "../outputs/StudentMinAggregate";
import { StudentSumAggregate } from "../outputs/StudentSumAggregate";

@TypeGraphQL.ObjectType("AggregateStudent", {
  isAbstract: true
})
export class AggregateStudent {
  @TypeGraphQL.Field(_type => StudentCountAggregate, {
    nullable: true
  })
  _count!: StudentCountAggregate | null;

  @TypeGraphQL.Field(_type => StudentAvgAggregate, {
    nullable: true
  })
  _avg!: StudentAvgAggregate | null;

  @TypeGraphQL.Field(_type => StudentSumAggregate, {
    nullable: true
  })
  _sum!: StudentSumAggregate | null;

  @TypeGraphQL.Field(_type => StudentMinAggregate, {
    nullable: true
  })
  _min!: StudentMinAggregate | null;

  @TypeGraphQL.Field(_type => StudentMaxAggregate, {
    nullable: true
  })
  _max!: StudentMaxAggregate | null;
}
