import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expertise_tagAvgOrderByAggregateInput } from "../inputs/Expertise_tagAvgOrderByAggregateInput";
import { Expertise_tagCountOrderByAggregateInput } from "../inputs/Expertise_tagCountOrderByAggregateInput";
import { Expertise_tagMaxOrderByAggregateInput } from "../inputs/Expertise_tagMaxOrderByAggregateInput";
import { Expertise_tagMinOrderByAggregateInput } from "../inputs/Expertise_tagMinOrderByAggregateInput";
import { Expertise_tagSumOrderByAggregateInput } from "../inputs/Expertise_tagSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("Expertise_tagOrderByWithAggregationInput", {
  isAbstract: true
})
export class Expertise_tagOrderByWithAggregationInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  id?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  name?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => Expertise_tagCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: Expertise_tagCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Expertise_tagAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: Expertise_tagAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Expertise_tagMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: Expertise_tagMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Expertise_tagMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: Expertise_tagMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Expertise_tagSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: Expertise_tagSumOrderByAggregateInput | undefined;
}
