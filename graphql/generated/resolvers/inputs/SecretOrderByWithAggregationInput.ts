import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SecretAvgOrderByAggregateInput } from "../inputs/SecretAvgOrderByAggregateInput";
import { SecretCountOrderByAggregateInput } from "../inputs/SecretCountOrderByAggregateInput";
import { SecretMaxOrderByAggregateInput } from "../inputs/SecretMaxOrderByAggregateInput";
import { SecretMinOrderByAggregateInput } from "../inputs/SecretMinOrderByAggregateInput";
import { SecretSumOrderByAggregateInput } from "../inputs/SecretSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("SecretOrderByWithAggregationInput", {
  isAbstract: true
})
export class SecretOrderByWithAggregationInput {
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
  userId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  type?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  secret?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  expiresAt?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  lastUsed?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SecretCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: SecretCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => SecretAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: SecretAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => SecretMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: SecretMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => SecretMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: SecretMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => SecretSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: SecretSumOrderByAggregateInput | undefined;
}
