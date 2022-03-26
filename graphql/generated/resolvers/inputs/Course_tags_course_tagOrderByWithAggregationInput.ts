import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_tags_course_tagAvgOrderByAggregateInput } from "../inputs/Course_tags_course_tagAvgOrderByAggregateInput";
import { Course_tags_course_tagCountOrderByAggregateInput } from "../inputs/Course_tags_course_tagCountOrderByAggregateInput";
import { Course_tags_course_tagMaxOrderByAggregateInput } from "../inputs/Course_tags_course_tagMaxOrderByAggregateInput";
import { Course_tags_course_tagMinOrderByAggregateInput } from "../inputs/Course_tags_course_tagMinOrderByAggregateInput";
import { Course_tags_course_tagSumOrderByAggregateInput } from "../inputs/Course_tags_course_tagSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("Course_tags_course_tagOrderByWithAggregationInput", {
  isAbstract: true
})
export class Course_tags_course_tagOrderByWithAggregationInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  courseId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  courseTagId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => Course_tags_course_tagCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: Course_tags_course_tagCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Course_tags_course_tagAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: Course_tags_course_tagAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Course_tags_course_tagMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: Course_tags_course_tagMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Course_tags_course_tagMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: Course_tags_course_tagMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Course_tags_course_tagSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: Course_tags_course_tagSumOrderByAggregateInput | undefined;
}
