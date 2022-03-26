import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Project_field_with_grade_restrictionOrderByWithAggregationInput } from "../../../inputs/Project_field_with_grade_restrictionOrderByWithAggregationInput";
import { Project_field_with_grade_restrictionScalarWhereWithAggregatesInput } from "../../../inputs/Project_field_with_grade_restrictionScalarWhereWithAggregatesInput";
import { Project_field_with_grade_restrictionWhereInput } from "../../../inputs/Project_field_with_grade_restrictionWhereInput";
import { Project_field_with_grade_restrictionScalarFieldEnum } from "../../../../enums/Project_field_with_grade_restrictionScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByProject_field_with_grade_restrictionArgs {
  @TypeGraphQL.Field(_type => Project_field_with_grade_restrictionWhereInput, {
    nullable: true
  })
  where?: Project_field_with_grade_restrictionWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Project_field_with_grade_restrictionOrderByWithAggregationInput], {
    nullable: true
  })
  orderBy?: Project_field_with_grade_restrictionOrderByWithAggregationInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_field_with_grade_restrictionScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "createdAt" | "updatedAt" | "projectField" | "min" | "max" | "studentId">;

  @TypeGraphQL.Field(_type => Project_field_with_grade_restrictionScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: Project_field_with_grade_restrictionScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
