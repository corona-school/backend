import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Participation_certificateAvgAggregate } from "../outputs/Participation_certificateAvgAggregate";
import { Participation_certificateCountAggregate } from "../outputs/Participation_certificateCountAggregate";
import { Participation_certificateMaxAggregate } from "../outputs/Participation_certificateMaxAggregate";
import { Participation_certificateMinAggregate } from "../outputs/Participation_certificateMinAggregate";
import { Participation_certificateSumAggregate } from "../outputs/Participation_certificateSumAggregate";

@TypeGraphQL.ObjectType("AggregateParticipation_certificate", {
  isAbstract: true
})
export class AggregateParticipation_certificate {
  @TypeGraphQL.Field(_type => Participation_certificateCountAggregate, {
    nullable: true
  })
  _count!: Participation_certificateCountAggregate | null;

  @TypeGraphQL.Field(_type => Participation_certificateAvgAggregate, {
    nullable: true
  })
  _avg!: Participation_certificateAvgAggregate | null;

  @TypeGraphQL.Field(_type => Participation_certificateSumAggregate, {
    nullable: true
  })
  _sum!: Participation_certificateSumAggregate | null;

  @TypeGraphQL.Field(_type => Participation_certificateMinAggregate, {
    nullable: true
  })
  _min!: Participation_certificateMinAggregate | null;

  @TypeGraphQL.Field(_type => Participation_certificateMaxAggregate, {
    nullable: true
  })
  _max!: Participation_certificateMaxAggregate | null;
}
