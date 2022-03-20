import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Project_field_with_grade_restrictionAvgAggregate } from "../outputs/Project_field_with_grade_restrictionAvgAggregate";
import { Project_field_with_grade_restrictionCountAggregate } from "../outputs/Project_field_with_grade_restrictionCountAggregate";
import { Project_field_with_grade_restrictionMaxAggregate } from "../outputs/Project_field_with_grade_restrictionMaxAggregate";
import { Project_field_with_grade_restrictionMinAggregate } from "../outputs/Project_field_with_grade_restrictionMinAggregate";
import { Project_field_with_grade_restrictionSumAggregate } from "../outputs/Project_field_with_grade_restrictionSumAggregate";

@TypeGraphQL.ObjectType("AggregateProject_field_with_grade_restriction", {
  isAbstract: true
})
export class AggregateProject_field_with_grade_restriction {
  @TypeGraphQL.Field(_type => Project_field_with_grade_restrictionCountAggregate, {
    nullable: true
  })
  _count!: Project_field_with_grade_restrictionCountAggregate | null;

  @TypeGraphQL.Field(_type => Project_field_with_grade_restrictionAvgAggregate, {
    nullable: true
  })
  _avg!: Project_field_with_grade_restrictionAvgAggregate | null;

  @TypeGraphQL.Field(_type => Project_field_with_grade_restrictionSumAggregate, {
    nullable: true
  })
  _sum!: Project_field_with_grade_restrictionSumAggregate | null;

  @TypeGraphQL.Field(_type => Project_field_with_grade_restrictionMinAggregate, {
    nullable: true
  })
  _min!: Project_field_with_grade_restrictionMinAggregate | null;

  @TypeGraphQL.Field(_type => Project_field_with_grade_restrictionMaxAggregate, {
    nullable: true
  })
  _max!: Project_field_with_grade_restrictionMaxAggregate | null;
}
