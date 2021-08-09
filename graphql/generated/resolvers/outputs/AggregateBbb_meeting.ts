import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Bbb_meetingAvgAggregate } from "../outputs/Bbb_meetingAvgAggregate";
import { Bbb_meetingCountAggregate } from "../outputs/Bbb_meetingCountAggregate";
import { Bbb_meetingMaxAggregate } from "../outputs/Bbb_meetingMaxAggregate";
import { Bbb_meetingMinAggregate } from "../outputs/Bbb_meetingMinAggregate";
import { Bbb_meetingSumAggregate } from "../outputs/Bbb_meetingSumAggregate";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class AggregateBbb_meeting {
  @TypeGraphQL.Field(_type => Bbb_meetingCountAggregate, {
    nullable: true
  })
  _count!: Bbb_meetingCountAggregate | null;

  @TypeGraphQL.Field(_type => Bbb_meetingAvgAggregate, {
    nullable: true
  })
  _avg!: Bbb_meetingAvgAggregate | null;

  @TypeGraphQL.Field(_type => Bbb_meetingSumAggregate, {
    nullable: true
  })
  _sum!: Bbb_meetingSumAggregate | null;

  @TypeGraphQL.Field(_type => Bbb_meetingMinAggregate, {
    nullable: true
  })
  _min!: Bbb_meetingMinAggregate | null;

  @TypeGraphQL.Field(_type => Bbb_meetingMaxAggregate, {
    nullable: true
  })
  _max!: Bbb_meetingMaxAggregate | null;
}
