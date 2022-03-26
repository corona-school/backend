import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_guestAvgOrderByAggregateInput } from "../inputs/Course_guestAvgOrderByAggregateInput";
import { Course_guestCountOrderByAggregateInput } from "../inputs/Course_guestCountOrderByAggregateInput";
import { Course_guestMaxOrderByAggregateInput } from "../inputs/Course_guestMaxOrderByAggregateInput";
import { Course_guestMinOrderByAggregateInput } from "../inputs/Course_guestMinOrderByAggregateInput";
import { Course_guestSumOrderByAggregateInput } from "../inputs/Course_guestSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("Course_guestOrderByWithAggregationInput", {
  isAbstract: true
})
export class Course_guestOrderByWithAggregationInput {
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
  token?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  firstname?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  lastname?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  email?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  courseId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  inviterId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => Course_guestCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: Course_guestCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Course_guestAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: Course_guestAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Course_guestMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: Course_guestMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Course_guestMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: Course_guestMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Course_guestSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: Course_guestSumOrderByAggregateInput | undefined;
}
