import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Project_coaching_screeningAvgAggregate } from "../outputs/Project_coaching_screeningAvgAggregate";
import { Project_coaching_screeningCountAggregate } from "../outputs/Project_coaching_screeningCountAggregate";
import { Project_coaching_screeningMaxAggregate } from "../outputs/Project_coaching_screeningMaxAggregate";
import { Project_coaching_screeningMinAggregate } from "../outputs/Project_coaching_screeningMinAggregate";
import { Project_coaching_screeningSumAggregate } from "../outputs/Project_coaching_screeningSumAggregate";

@TypeGraphQL.ObjectType({
  isAbstract: true
})
export class Project_coaching_screeningGroupBy {
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

  @TypeGraphQL.Field(_type => Project_coaching_screeningCountAggregate, {
    nullable: true
  })
  _count!: Project_coaching_screeningCountAggregate | null;

  @TypeGraphQL.Field(_type => Project_coaching_screeningAvgAggregate, {
    nullable: true
  })
  _avg!: Project_coaching_screeningAvgAggregate | null;

  @TypeGraphQL.Field(_type => Project_coaching_screeningSumAggregate, {
    nullable: true
  })
  _sum!: Project_coaching_screeningSumAggregate | null;

  @TypeGraphQL.Field(_type => Project_coaching_screeningMinAggregate, {
    nullable: true
  })
  _min!: Project_coaching_screeningMinAggregate | null;

  @TypeGraphQL.Field(_type => Project_coaching_screeningMaxAggregate, {
    nullable: true
  })
  _max!: Project_coaching_screeningMaxAggregate | null;
}
