import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Project_matchAvgOrderByAggregateInput } from "../inputs/Project_matchAvgOrderByAggregateInput";
import { Project_matchCountOrderByAggregateInput } from "../inputs/Project_matchCountOrderByAggregateInput";
import { Project_matchMaxOrderByAggregateInput } from "../inputs/Project_matchMaxOrderByAggregateInput";
import { Project_matchMinOrderByAggregateInput } from "../inputs/Project_matchMinOrderByAggregateInput";
import { Project_matchSumOrderByAggregateInput } from "../inputs/Project_matchSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("Project_matchOrderByWithAggregationInput", {
  isAbstract: true
})
export class Project_matchOrderByWithAggregationInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  id?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  uuid?: "asc" | "desc" | undefined;

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
  dissolved?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  dissolveReason?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  studentId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  pupilId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => Project_matchCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: Project_matchCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Project_matchAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: Project_matchAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Project_matchMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: Project_matchMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Project_matchMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: Project_matchMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Project_matchSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: Project_matchSumOrderByAggregateInput | undefined;
}
