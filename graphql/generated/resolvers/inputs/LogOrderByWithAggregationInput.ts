import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { LogAvgOrderByAggregateInput } from "../inputs/LogAvgOrderByAggregateInput";
import { LogCountOrderByAggregateInput } from "../inputs/LogCountOrderByAggregateInput";
import { LogMaxOrderByAggregateInput } from "../inputs/LogMaxOrderByAggregateInput";
import { LogMinOrderByAggregateInput } from "../inputs/LogMinOrderByAggregateInput";
import { LogSumOrderByAggregateInput } from "../inputs/LogSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("LogOrderByWithAggregationInput", {
  isAbstract: true
})
export class LogOrderByWithAggregationInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  id?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  logtype?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  createdAt?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  user?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  data?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => LogCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: LogCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => LogAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: LogAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => LogMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: LogMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => LogMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: LogMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => LogSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: LogSumOrderByAggregateInput | undefined;
}
