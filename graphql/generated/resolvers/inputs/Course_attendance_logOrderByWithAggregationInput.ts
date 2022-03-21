import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_attendance_logAvgOrderByAggregateInput } from "../inputs/Course_attendance_logAvgOrderByAggregateInput";
import { Course_attendance_logCountOrderByAggregateInput } from "../inputs/Course_attendance_logCountOrderByAggregateInput";
import { Course_attendance_logMaxOrderByAggregateInput } from "../inputs/Course_attendance_logMaxOrderByAggregateInput";
import { Course_attendance_logMinOrderByAggregateInput } from "../inputs/Course_attendance_logMinOrderByAggregateInput";
import { Course_attendance_logSumOrderByAggregateInput } from "../inputs/Course_attendance_logSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("Course_attendance_logOrderByWithAggregationInput", {
  isAbstract: true
})
export class Course_attendance_logOrderByWithAggregationInput {
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
  attendedTime?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  ip?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  pupilId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  lectureId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => Course_attendance_logCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: Course_attendance_logCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Course_attendance_logAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: Course_attendance_logAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Course_attendance_logMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: Course_attendance_logMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Course_attendance_logMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: Course_attendance_logMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Course_attendance_logSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: Course_attendance_logSumOrderByAggregateInput | undefined;
}
