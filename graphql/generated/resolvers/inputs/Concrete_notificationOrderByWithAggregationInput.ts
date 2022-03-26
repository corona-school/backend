import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Concrete_notificationAvgOrderByAggregateInput } from "../inputs/Concrete_notificationAvgOrderByAggregateInput";
import { Concrete_notificationCountOrderByAggregateInput } from "../inputs/Concrete_notificationCountOrderByAggregateInput";
import { Concrete_notificationMaxOrderByAggregateInput } from "../inputs/Concrete_notificationMaxOrderByAggregateInput";
import { Concrete_notificationMinOrderByAggregateInput } from "../inputs/Concrete_notificationMinOrderByAggregateInput";
import { Concrete_notificationSumOrderByAggregateInput } from "../inputs/Concrete_notificationSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("Concrete_notificationOrderByWithAggregationInput", {
  isAbstract: true
})
export class Concrete_notificationOrderByWithAggregationInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  id?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  userId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  notificationID?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  contextID?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  context?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  sentAt?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  state?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  error?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => Concrete_notificationCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: Concrete_notificationCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Concrete_notificationAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: Concrete_notificationAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Concrete_notificationMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: Concrete_notificationMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Concrete_notificationMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: Concrete_notificationMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Concrete_notificationSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: Concrete_notificationSumOrderByAggregateInput | undefined;
}
