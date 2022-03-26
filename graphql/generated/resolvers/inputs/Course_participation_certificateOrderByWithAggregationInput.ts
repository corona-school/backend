import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_participation_certificateAvgOrderByAggregateInput } from "../inputs/Course_participation_certificateAvgOrderByAggregateInput";
import { Course_participation_certificateCountOrderByAggregateInput } from "../inputs/Course_participation_certificateCountOrderByAggregateInput";
import { Course_participation_certificateMaxOrderByAggregateInput } from "../inputs/Course_participation_certificateMaxOrderByAggregateInput";
import { Course_participation_certificateMinOrderByAggregateInput } from "../inputs/Course_participation_certificateMinOrderByAggregateInput";
import { Course_participation_certificateSumOrderByAggregateInput } from "../inputs/Course_participation_certificateSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("Course_participation_certificateOrderByWithAggregationInput", {
  isAbstract: true
})
export class Course_participation_certificateOrderByWithAggregationInput {
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
  issuerId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  pupilId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  subcourseId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => Course_participation_certificateCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: Course_participation_certificateCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Course_participation_certificateAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: Course_participation_certificateAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Course_participation_certificateMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: Course_participation_certificateMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Course_participation_certificateMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: Course_participation_certificateMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Course_participation_certificateSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: Course_participation_certificateSumOrderByAggregateInput | undefined;
}
