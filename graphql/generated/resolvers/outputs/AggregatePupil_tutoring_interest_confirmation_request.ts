import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Pupil_tutoring_interest_confirmation_requestAvgAggregate } from "../outputs/Pupil_tutoring_interest_confirmation_requestAvgAggregate";
import { Pupil_tutoring_interest_confirmation_requestCountAggregate } from "../outputs/Pupil_tutoring_interest_confirmation_requestCountAggregate";
import { Pupil_tutoring_interest_confirmation_requestMaxAggregate } from "../outputs/Pupil_tutoring_interest_confirmation_requestMaxAggregate";
import { Pupil_tutoring_interest_confirmation_requestMinAggregate } from "../outputs/Pupil_tutoring_interest_confirmation_requestMinAggregate";
import { Pupil_tutoring_interest_confirmation_requestSumAggregate } from "../outputs/Pupil_tutoring_interest_confirmation_requestSumAggregate";

@TypeGraphQL.ObjectType("AggregatePupil_tutoring_interest_confirmation_request", {
  isAbstract: true
})
export class AggregatePupil_tutoring_interest_confirmation_request {
  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestCountAggregate, {
    nullable: true
  })
  _count!: Pupil_tutoring_interest_confirmation_requestCountAggregate | null;

  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestAvgAggregate, {
    nullable: true
  })
  _avg!: Pupil_tutoring_interest_confirmation_requestAvgAggregate | null;

  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestSumAggregate, {
    nullable: true
  })
  _sum!: Pupil_tutoring_interest_confirmation_requestSumAggregate | null;

  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestMinAggregate, {
    nullable: true
  })
  _min!: Pupil_tutoring_interest_confirmation_requestMinAggregate | null;

  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestMaxAggregate, {
    nullable: true
  })
  _max!: Pupil_tutoring_interest_confirmation_requestMaxAggregate | null;
}
