import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Project_coaching_screeningAvgOrderByAggregateInput } from "../inputs/Project_coaching_screeningAvgOrderByAggregateInput";
import { Project_coaching_screeningCountOrderByAggregateInput } from "../inputs/Project_coaching_screeningCountOrderByAggregateInput";
import { Project_coaching_screeningMaxOrderByAggregateInput } from "../inputs/Project_coaching_screeningMaxOrderByAggregateInput";
import { Project_coaching_screeningMinOrderByAggregateInput } from "../inputs/Project_coaching_screeningMinOrderByAggregateInput";
import { Project_coaching_screeningSumOrderByAggregateInput } from "../inputs/Project_coaching_screeningSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("Project_coaching_screeningOrderByWithAggregationInput", {
  isAbstract: true
})
export class Project_coaching_screeningOrderByWithAggregationInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  id?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  success?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  comment?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  knowsCoronaSchoolFrom?: "asc" | "desc" | undefined;

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
  screenerId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  studentId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => Project_coaching_screeningCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: Project_coaching_screeningCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Project_coaching_screeningAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: Project_coaching_screeningAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Project_coaching_screeningMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: Project_coaching_screeningMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Project_coaching_screeningMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: Project_coaching_screeningMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Project_coaching_screeningSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: Project_coaching_screeningSumOrderByAggregateInput | undefined;
}
