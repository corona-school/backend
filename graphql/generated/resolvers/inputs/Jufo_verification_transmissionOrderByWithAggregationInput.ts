import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Jufo_verification_transmissionAvgOrderByAggregateInput } from "../inputs/Jufo_verification_transmissionAvgOrderByAggregateInput";
import { Jufo_verification_transmissionCountOrderByAggregateInput } from "../inputs/Jufo_verification_transmissionCountOrderByAggregateInput";
import { Jufo_verification_transmissionMaxOrderByAggregateInput } from "../inputs/Jufo_verification_transmissionMaxOrderByAggregateInput";
import { Jufo_verification_transmissionMinOrderByAggregateInput } from "../inputs/Jufo_verification_transmissionMinOrderByAggregateInput";
import { Jufo_verification_transmissionSumOrderByAggregateInput } from "../inputs/Jufo_verification_transmissionSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("Jufo_verification_transmissionOrderByWithAggregationInput", {
  isAbstract: true
})
export class Jufo_verification_transmissionOrderByWithAggregationInput {
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
  uuid?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  studentId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => Jufo_verification_transmissionCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: Jufo_verification_transmissionCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Jufo_verification_transmissionAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: Jufo_verification_transmissionAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Jufo_verification_transmissionMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: Jufo_verification_transmissionMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Jufo_verification_transmissionMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: Jufo_verification_transmissionMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Jufo_verification_transmissionSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: Jufo_verification_transmissionSumOrderByAggregateInput | undefined;
}
