import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Project_field_with_grade_restrictionAvgOrderByAggregateInput } from "../inputs/Project_field_with_grade_restrictionAvgOrderByAggregateInput";
import { Project_field_with_grade_restrictionCountOrderByAggregateInput } from "../inputs/Project_field_with_grade_restrictionCountOrderByAggregateInput";
import { Project_field_with_grade_restrictionMaxOrderByAggregateInput } from "../inputs/Project_field_with_grade_restrictionMaxOrderByAggregateInput";
import { Project_field_with_grade_restrictionMinOrderByAggregateInput } from "../inputs/Project_field_with_grade_restrictionMinOrderByAggregateInput";
import { Project_field_with_grade_restrictionSumOrderByAggregateInput } from "../inputs/Project_field_with_grade_restrictionSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("Project_field_with_grade_restrictionOrderByWithAggregationInput", {
  isAbstract: true
})
export class Project_field_with_grade_restrictionOrderByWithAggregationInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  id?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  createdAt?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  updatedAt?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  projectField?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  min?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  max?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  studentId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => Project_field_with_grade_restrictionCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: Project_field_with_grade_restrictionCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Project_field_with_grade_restrictionAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: Project_field_with_grade_restrictionAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Project_field_with_grade_restrictionMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: Project_field_with_grade_restrictionMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Project_field_with_grade_restrictionMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: Project_field_with_grade_restrictionMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Project_field_with_grade_restrictionSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: Project_field_with_grade_restrictionSumOrderByAggregateInput | undefined;
}
