import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Remission_requestAvgOrderByAggregateInput } from "../inputs/Remission_requestAvgOrderByAggregateInput";
import { Remission_requestCountOrderByAggregateInput } from "../inputs/Remission_requestCountOrderByAggregateInput";
import { Remission_requestMaxOrderByAggregateInput } from "../inputs/Remission_requestMaxOrderByAggregateInput";
import { Remission_requestMinOrderByAggregateInput } from "../inputs/Remission_requestMinOrderByAggregateInput";
import { Remission_requestSumOrderByAggregateInput } from "../inputs/Remission_requestSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("Remission_requestOrderByWithAggregationInput", {
  isAbstract: true
})
export class Remission_requestOrderByWithAggregationInput {
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
  uuid?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  studentId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => Remission_requestCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: Remission_requestCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Remission_requestAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: Remission_requestAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Remission_requestMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: Remission_requestMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Remission_requestMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: Remission_requestMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Remission_requestSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: Remission_requestSumOrderByAggregateInput | undefined;
}
