import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseAvgOrderByAggregateInput } from "../inputs/CourseAvgOrderByAggregateInput";
import { CourseCountOrderByAggregateInput } from "../inputs/CourseCountOrderByAggregateInput";
import { CourseMaxOrderByAggregateInput } from "../inputs/CourseMaxOrderByAggregateInput";
import { CourseMinOrderByAggregateInput } from "../inputs/CourseMinOrderByAggregateInput";
import { CourseSumOrderByAggregateInput } from "../inputs/CourseSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("CourseOrderByWithAggregationInput", {
  isAbstract: true
})
export class CourseOrderByWithAggregationInput {
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
  name?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  outline?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  description?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  imageKey?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  category?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  courseState?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  screeningComment?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  publicRanking?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  allowContact?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  correspondentId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => CourseCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: CourseCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => CourseAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: CourseAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => CourseMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: CourseMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => CourseMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: CourseMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => CourseSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: CourseSumOrderByAggregateInput | undefined;
}
