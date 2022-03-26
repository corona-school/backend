import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NotificationAvgOrderByAggregateInput } from "../inputs/NotificationAvgOrderByAggregateInput";
import { NotificationCountOrderByAggregateInput } from "../inputs/NotificationCountOrderByAggregateInput";
import { NotificationMaxOrderByAggregateInput } from "../inputs/NotificationMaxOrderByAggregateInput";
import { NotificationMinOrderByAggregateInput } from "../inputs/NotificationMinOrderByAggregateInput";
import { NotificationSumOrderByAggregateInput } from "../inputs/NotificationSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("NotificationOrderByWithAggregationInput", {
  isAbstract: true
})
export class NotificationOrderByWithAggregationInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  id?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  mailjetTemplateId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  description?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  active?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  recipient?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  onActions?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  category?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  cancelledOnAction?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  delay?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  interval?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  sender?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => NotificationCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: NotificationCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => NotificationAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: NotificationAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => NotificationMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: NotificationMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => NotificationMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: NotificationMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => NotificationSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: NotificationSumOrderByAggregateInput | undefined;
}
