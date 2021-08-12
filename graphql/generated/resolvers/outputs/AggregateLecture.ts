import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { LectureAvgAggregate } from "../outputs/LectureAvgAggregate";
import { LectureCountAggregate } from "../outputs/LectureCountAggregate";
import { LectureMaxAggregate } from "../outputs/LectureMaxAggregate";
import { LectureMinAggregate } from "../outputs/LectureMinAggregate";
import { LectureSumAggregate } from "../outputs/LectureSumAggregate";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class AggregateLecture {
  @TypeGraphQL.Field(_type => LectureCountAggregate, {
    nullable: true
  })
  _count!: LectureCountAggregate | null;

  @TypeGraphQL.Field(_type => LectureAvgAggregate, {
    nullable: true
  })
  _avg!: LectureAvgAggregate | null;

  @TypeGraphQL.Field(_type => LectureSumAggregate, {
    nullable: true
  })
  _sum!: LectureSumAggregate | null;

  @TypeGraphQL.Field(_type => LectureMinAggregate, {
    nullable: true
  })
  _min!: LectureMinAggregate | null;

  @TypeGraphQL.Field(_type => LectureMaxAggregate, {
    nullable: true
  })
  _max!: LectureMaxAggregate | null;
}
