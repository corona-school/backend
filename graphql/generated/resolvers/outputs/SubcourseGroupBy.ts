import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SubcourseAvgAggregate } from "../outputs/SubcourseAvgAggregate";
import { SubcourseCountAggregate } from "../outputs/SubcourseCountAggregate";
import { SubcourseMaxAggregate } from "../outputs/SubcourseMaxAggregate";
import { SubcourseMinAggregate } from "../outputs/SubcourseMinAggregate";
import { SubcourseSumAggregate } from "../outputs/SubcourseSumAggregate";

@TypeGraphQL.ObjectType("SubcourseGroupBy", {
  isAbstract: true
})
export class SubcourseGroupBy {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  id!: number;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  createdAt!: Date;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  updatedAt!: Date;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  minGrade!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  maxGrade!: number;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  maxParticipants!: number;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  joinAfterStart!: boolean;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  published!: boolean;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  cancelled!: boolean;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  courseId!: number | null;

  @TypeGraphQL.Field(_type => SubcourseCountAggregate, {
    nullable: true
  })
  _count!: SubcourseCountAggregate | null;

  @TypeGraphQL.Field(_type => SubcourseAvgAggregate, {
    nullable: true
  })
  _avg!: SubcourseAvgAggregate | null;

  @TypeGraphQL.Field(_type => SubcourseSumAggregate, {
    nullable: true
  })
  _sum!: SubcourseSumAggregate | null;

  @TypeGraphQL.Field(_type => SubcourseMinAggregate, {
    nullable: true
  })
  _min!: SubcourseMinAggregate | null;

  @TypeGraphQL.Field(_type => SubcourseMaxAggregate, {
    nullable: true
  })
  _max!: SubcourseMaxAggregate | null;
}
