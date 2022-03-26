import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Bbb_meetingAvgOrderByAggregateInput } from "../inputs/Bbb_meetingAvgOrderByAggregateInput";
import { Bbb_meetingCountOrderByAggregateInput } from "../inputs/Bbb_meetingCountOrderByAggregateInput";
import { Bbb_meetingMaxOrderByAggregateInput } from "../inputs/Bbb_meetingMaxOrderByAggregateInput";
import { Bbb_meetingMinOrderByAggregateInput } from "../inputs/Bbb_meetingMinOrderByAggregateInput";
import { Bbb_meetingSumOrderByAggregateInput } from "../inputs/Bbb_meetingSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("Bbb_meetingOrderByWithAggregationInput", {
  isAbstract: true
})
export class Bbb_meetingOrderByWithAggregationInput {
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
  meetingID?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  meetingName?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  attendeePW?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  moderatorPW?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  alternativeUrl?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => Bbb_meetingCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: Bbb_meetingCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Bbb_meetingAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: Bbb_meetingAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Bbb_meetingMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: Bbb_meetingMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Bbb_meetingMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: Bbb_meetingMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Bbb_meetingSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: Bbb_meetingSumOrderByAggregateInput | undefined;
}
