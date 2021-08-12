import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_participation_certificateAvgAggregate } from "../outputs/Course_participation_certificateAvgAggregate";
import { Course_participation_certificateCountAggregate } from "../outputs/Course_participation_certificateCountAggregate";
import { Course_participation_certificateMaxAggregate } from "../outputs/Course_participation_certificateMaxAggregate";
import { Course_participation_certificateMinAggregate } from "../outputs/Course_participation_certificateMinAggregate";
import { Course_participation_certificateSumAggregate } from "../outputs/Course_participation_certificateSumAggregate";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class AggregateCourse_participation_certificate {
  @TypeGraphQL.Field(_type => Course_participation_certificateCountAggregate, {
    nullable: true
  })
  _count!: Course_participation_certificateCountAggregate | null;

  @TypeGraphQL.Field(_type => Course_participation_certificateAvgAggregate, {
    nullable: true
  })
  _avg!: Course_participation_certificateAvgAggregate | null;

  @TypeGraphQL.Field(_type => Course_participation_certificateSumAggregate, {
    nullable: true
  })
  _sum!: Course_participation_certificateSumAggregate | null;

  @TypeGraphQL.Field(_type => Course_participation_certificateMinAggregate, {
    nullable: true
  })
  _min!: Course_participation_certificateMinAggregate | null;

  @TypeGraphQL.Field(_type => Course_participation_certificateMaxAggregate, {
    nullable: true
  })
  _max!: Course_participation_certificateMaxAggregate | null;
}
