import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_tagAvgOrderByAggregateInput } from "../inputs/Course_tagAvgOrderByAggregateInput";
import { Course_tagCountOrderByAggregateInput } from "../inputs/Course_tagCountOrderByAggregateInput";
import { Course_tagMaxOrderByAggregateInput } from "../inputs/Course_tagMaxOrderByAggregateInput";
import { Course_tagMinOrderByAggregateInput } from "../inputs/Course_tagMinOrderByAggregateInput";
import { Course_tagSumOrderByAggregateInput } from "../inputs/Course_tagSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("Course_tagOrderByWithAggregationInput", {
  isAbstract: true
})
export class Course_tagOrderByWithAggregationInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  id?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  identifier?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  name?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  category?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => Course_tagCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: Course_tagCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Course_tagAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: Course_tagAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Course_tagMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: Course_tagMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Course_tagMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: Course_tagMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Course_tagSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: Course_tagSumOrderByAggregateInput | undefined;
}
