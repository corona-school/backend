import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Match_pool_runAvgOrderByAggregateInput } from "../inputs/Match_pool_runAvgOrderByAggregateInput";
import { Match_pool_runCountOrderByAggregateInput } from "../inputs/Match_pool_runCountOrderByAggregateInput";
import { Match_pool_runMaxOrderByAggregateInput } from "../inputs/Match_pool_runMaxOrderByAggregateInput";
import { Match_pool_runMinOrderByAggregateInput } from "../inputs/Match_pool_runMinOrderByAggregateInput";
import { Match_pool_runSumOrderByAggregateInput } from "../inputs/Match_pool_runSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("Match_pool_runOrderByWithAggregationInput", {
  isAbstract: true
})
export class Match_pool_runOrderByWithAggregationInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  id?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  runAt?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  matchingPool?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  matchesCreated?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  stats?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => Match_pool_runCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: Match_pool_runCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Match_pool_runAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: Match_pool_runAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Match_pool_runMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: Match_pool_runMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Match_pool_runMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: Match_pool_runMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Match_pool_runSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: Match_pool_runSumOrderByAggregateInput | undefined;
}
