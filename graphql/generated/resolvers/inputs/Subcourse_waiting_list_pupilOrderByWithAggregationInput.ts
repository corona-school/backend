import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_waiting_list_pupilAvgOrderByAggregateInput } from "../inputs/Subcourse_waiting_list_pupilAvgOrderByAggregateInput";
import { Subcourse_waiting_list_pupilCountOrderByAggregateInput } from "../inputs/Subcourse_waiting_list_pupilCountOrderByAggregateInput";
import { Subcourse_waiting_list_pupilMaxOrderByAggregateInput } from "../inputs/Subcourse_waiting_list_pupilMaxOrderByAggregateInput";
import { Subcourse_waiting_list_pupilMinOrderByAggregateInput } from "../inputs/Subcourse_waiting_list_pupilMinOrderByAggregateInput";
import { Subcourse_waiting_list_pupilSumOrderByAggregateInput } from "../inputs/Subcourse_waiting_list_pupilSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("Subcourse_waiting_list_pupilOrderByWithAggregationInput", {
  isAbstract: true
})
export class Subcourse_waiting_list_pupilOrderByWithAggregationInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  subcourseId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  pupilId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: Subcourse_waiting_list_pupilCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: Subcourse_waiting_list_pupilAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: Subcourse_waiting_list_pupilMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: Subcourse_waiting_list_pupilMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: Subcourse_waiting_list_pupilSumOrderByAggregateInput | undefined;
}
