import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expert_dataAvgOrderByAggregateInput } from "../inputs/Expert_dataAvgOrderByAggregateInput";
import { Expert_dataCountOrderByAggregateInput } from "../inputs/Expert_dataCountOrderByAggregateInput";
import { Expert_dataMaxOrderByAggregateInput } from "../inputs/Expert_dataMaxOrderByAggregateInput";
import { Expert_dataMinOrderByAggregateInput } from "../inputs/Expert_dataMinOrderByAggregateInput";
import { Expert_dataSumOrderByAggregateInput } from "../inputs/Expert_dataSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("Expert_dataOrderByWithAggregationInput", {
  isAbstract: true
})
export class Expert_dataOrderByWithAggregationInput {
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
  contactEmail?: "asc" | "desc" | undefined;

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
  allowed?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  studentId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => Expert_dataCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: Expert_dataCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Expert_dataAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: Expert_dataAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Expert_dataMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: Expert_dataMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Expert_dataMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: Expert_dataMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Expert_dataSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: Expert_dataSumOrderByAggregateInput | undefined;
}
