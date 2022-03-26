import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { LectureAvgOrderByAggregateInput } from "../inputs/LectureAvgOrderByAggregateInput";
import { LectureCountOrderByAggregateInput } from "../inputs/LectureCountOrderByAggregateInput";
import { LectureMaxOrderByAggregateInput } from "../inputs/LectureMaxOrderByAggregateInput";
import { LectureMinOrderByAggregateInput } from "../inputs/LectureMinOrderByAggregateInput";
import { LectureSumOrderByAggregateInput } from "../inputs/LectureSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("LectureOrderByWithAggregationInput", {
  isAbstract: true
})
export class LectureOrderByWithAggregationInput {
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
  start?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  duration?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  instructorId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  subcourseId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => LectureCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: LectureCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => LectureAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: LectureAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => LectureMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: LectureMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => LectureMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: LectureMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => LectureSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: LectureSumOrderByAggregateInput | undefined;
}
