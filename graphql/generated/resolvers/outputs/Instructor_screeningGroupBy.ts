import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Instructor_screeningAvgAggregate } from "../outputs/Instructor_screeningAvgAggregate";
import { Instructor_screeningCountAggregate } from "../outputs/Instructor_screeningCountAggregate";
import { Instructor_screeningMaxAggregate } from "../outputs/Instructor_screeningMaxAggregate";
import { Instructor_screeningMinAggregate } from "../outputs/Instructor_screeningMinAggregate";
import { Instructor_screeningSumAggregate } from "../outputs/Instructor_screeningSumAggregate";

@TypeGraphQL.ObjectType("Instructor_screeningGroupBy", {
  isAbstract: true
})
export class Instructor_screeningGroupBy {
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

  @TypeGraphQL.Field(_type => Instructor_screeningCountAggregate, {
    nullable: true
  })
  _count!: Instructor_screeningCountAggregate | null;

  @TypeGraphQL.Field(_type => Instructor_screeningAvgAggregate, {
    nullable: true
  })
  _avg!: Instructor_screeningAvgAggregate | null;

  @TypeGraphQL.Field(_type => Instructor_screeningSumAggregate, {
    nullable: true
  })
  _sum!: Instructor_screeningSumAggregate | null;

  @TypeGraphQL.Field(_type => Instructor_screeningMinAggregate, {
    nullable: true
  })
  _min!: Instructor_screeningMinAggregate | null;

  @TypeGraphQL.Field(_type => Instructor_screeningMaxAggregate, {
    nullable: true
  })
  _max!: Instructor_screeningMaxAggregate | null;
}
