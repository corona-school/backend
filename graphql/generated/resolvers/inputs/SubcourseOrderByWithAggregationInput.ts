import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SubcourseAvgOrderByAggregateInput } from "../inputs/SubcourseAvgOrderByAggregateInput";
import { SubcourseCountOrderByAggregateInput } from "../inputs/SubcourseCountOrderByAggregateInput";
import { SubcourseMaxOrderByAggregateInput } from "../inputs/SubcourseMaxOrderByAggregateInput";
import { SubcourseMinOrderByAggregateInput } from "../inputs/SubcourseMinOrderByAggregateInput";
import { SubcourseSumOrderByAggregateInput } from "../inputs/SubcourseSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("SubcourseOrderByWithAggregationInput", {
  isAbstract: true
})
export class SubcourseOrderByWithAggregationInput {
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
  minGrade?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  maxGrade?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  maxParticipants?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  joinAfterStart?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  published?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  cancelled?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  courseId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SubcourseCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: SubcourseCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: SubcourseAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: SubcourseMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: SubcourseMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: SubcourseSumOrderByAggregateInput | undefined;
}
