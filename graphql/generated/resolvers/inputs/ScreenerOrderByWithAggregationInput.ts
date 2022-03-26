import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreenerAvgOrderByAggregateInput } from "../inputs/ScreenerAvgOrderByAggregateInput";
import { ScreenerCountOrderByAggregateInput } from "../inputs/ScreenerCountOrderByAggregateInput";
import { ScreenerMaxOrderByAggregateInput } from "../inputs/ScreenerMaxOrderByAggregateInput";
import { ScreenerMinOrderByAggregateInput } from "../inputs/ScreenerMinOrderByAggregateInput";
import { ScreenerSumOrderByAggregateInput } from "../inputs/ScreenerSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("ScreenerOrderByWithAggregationInput", {
  isAbstract: true
})
export class ScreenerOrderByWithAggregationInput {
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
  firstname?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  lastname?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  active?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  email?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  verification?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  verifiedAt?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  authToken?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  authTokenUsed?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  authTokenSent?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  password?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  verified?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  oldNumberID?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => ScreenerCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: ScreenerCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => ScreenerAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: ScreenerAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => ScreenerMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: ScreenerMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => ScreenerMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: ScreenerMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => ScreenerSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: ScreenerSumOrderByAggregateInput | undefined;
}
