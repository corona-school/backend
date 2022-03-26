import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreeningAvgOrderByAggregateInput } from "../inputs/ScreeningAvgOrderByAggregateInput";
import { ScreeningCountOrderByAggregateInput } from "../inputs/ScreeningCountOrderByAggregateInput";
import { ScreeningMaxOrderByAggregateInput } from "../inputs/ScreeningMaxOrderByAggregateInput";
import { ScreeningMinOrderByAggregateInput } from "../inputs/ScreeningMinOrderByAggregateInput";
import { ScreeningSumOrderByAggregateInput } from "../inputs/ScreeningSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("ScreeningOrderByWithAggregationInput", {
  isAbstract: true
})
export class ScreeningOrderByWithAggregationInput {
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

  @TypeGraphQL.Field(_type => ScreeningCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: ScreeningCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => ScreeningAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: ScreeningAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => ScreeningMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: ScreeningMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => ScreeningMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: ScreeningMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => ScreeningSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: ScreeningSumOrderByAggregateInput | undefined;
}
