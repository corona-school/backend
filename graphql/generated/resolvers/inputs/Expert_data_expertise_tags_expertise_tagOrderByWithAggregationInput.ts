import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Expert_data_expertise_tags_expertise_tagAvgOrderByAggregateInput } from "../inputs/Expert_data_expertise_tags_expertise_tagAvgOrderByAggregateInput";
import { Expert_data_expertise_tags_expertise_tagCountOrderByAggregateInput } from "../inputs/Expert_data_expertise_tags_expertise_tagCountOrderByAggregateInput";
import { Expert_data_expertise_tags_expertise_tagMaxOrderByAggregateInput } from "../inputs/Expert_data_expertise_tags_expertise_tagMaxOrderByAggregateInput";
import { Expert_data_expertise_tags_expertise_tagMinOrderByAggregateInput } from "../inputs/Expert_data_expertise_tags_expertise_tagMinOrderByAggregateInput";
import { Expert_data_expertise_tags_expertise_tagSumOrderByAggregateInput } from "../inputs/Expert_data_expertise_tags_expertise_tagSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("Expert_data_expertise_tags_expertise_tagOrderByWithAggregationInput", {
  isAbstract: true
})
export class Expert_data_expertise_tags_expertise_tagOrderByWithAggregationInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  expertDataId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  expertiseTagId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: Expert_data_expertise_tags_expertise_tagCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: Expert_data_expertise_tags_expertise_tagAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: Expert_data_expertise_tags_expertise_tagMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: Expert_data_expertise_tags_expertise_tagMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Expert_data_expertise_tags_expertise_tagSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: Expert_data_expertise_tags_expertise_tagSumOrderByAggregateInput | undefined;
}
