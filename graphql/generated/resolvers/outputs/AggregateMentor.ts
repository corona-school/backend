import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { MentorAvgAggregate } from "../outputs/MentorAvgAggregate";
import { MentorCountAggregate } from "../outputs/MentorCountAggregate";
import { MentorMaxAggregate } from "../outputs/MentorMaxAggregate";
import { MentorMinAggregate } from "../outputs/MentorMinAggregate";
import { MentorSumAggregate } from "../outputs/MentorSumAggregate";

@TypeGraphQL.ObjectType("AggregateMentor", {
  isAbstract: true
})
export class AggregateMentor {
  @TypeGraphQL.Field(_type => MentorCountAggregate, {
    nullable: true
  })
  _count!: MentorCountAggregate | null;

  @TypeGraphQL.Field(_type => MentorAvgAggregate, {
    nullable: true
  })
  _avg!: MentorAvgAggregate | null;

  @TypeGraphQL.Field(_type => MentorSumAggregate, {
    nullable: true
  })
  _sum!: MentorSumAggregate | null;

  @TypeGraphQL.Field(_type => MentorMinAggregate, {
    nullable: true
  })
  _min!: MentorMinAggregate | null;

  @TypeGraphQL.Field(_type => MentorMaxAggregate, {
    nullable: true
  })
  _max!: MentorMaxAggregate | null;
}
