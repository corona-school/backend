import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { MentorAvgOrderByAggregateInput } from "../inputs/MentorAvgOrderByAggregateInput";
import { MentorCountOrderByAggregateInput } from "../inputs/MentorCountOrderByAggregateInput";
import { MentorMaxOrderByAggregateInput } from "../inputs/MentorMaxOrderByAggregateInput";
import { MentorMinOrderByAggregateInput } from "../inputs/MentorMinOrderByAggregateInput";
import { MentorSumOrderByAggregateInput } from "../inputs/MentorSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("MentorOrderByWithAggregationInput", {
  isAbstract: true
})
export class MentorOrderByWithAggregationInput {
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
  firstname?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  lastname?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  active?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  email?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  verification?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  verifiedAt?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  authToken?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  authTokenUsed?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  authTokenSent?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  wix_id?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  wix_creation_date?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  division?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  expertise?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  subjects?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  teachingExperience?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  message?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  description?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  imageUrl?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => MentorCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: MentorCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => MentorAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: MentorAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => MentorMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: MentorMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => MentorMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: MentorMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => MentorSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: MentorSumOrderByAggregateInput | undefined;
}
