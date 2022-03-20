import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Pupil_tutoring_interest_confirmation_requestAvgOrderByAggregateInput } from "../inputs/Pupil_tutoring_interest_confirmation_requestAvgOrderByAggregateInput";
import { Pupil_tutoring_interest_confirmation_requestCountOrderByAggregateInput } from "../inputs/Pupil_tutoring_interest_confirmation_requestCountOrderByAggregateInput";
import { Pupil_tutoring_interest_confirmation_requestMaxOrderByAggregateInput } from "../inputs/Pupil_tutoring_interest_confirmation_requestMaxOrderByAggregateInput";
import { Pupil_tutoring_interest_confirmation_requestMinOrderByAggregateInput } from "../inputs/Pupil_tutoring_interest_confirmation_requestMinOrderByAggregateInput";
import { Pupil_tutoring_interest_confirmation_requestSumOrderByAggregateInput } from "../inputs/Pupil_tutoring_interest_confirmation_requestSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("Pupil_tutoring_interest_confirmation_requestOrderByWithAggregationInput", {
  isAbstract: true
})
export class Pupil_tutoring_interest_confirmation_requestOrderByWithAggregationInput {
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
  status?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  token?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  reminderSentDate?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  pupilId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: Pupil_tutoring_interest_confirmation_requestCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: Pupil_tutoring_interest_confirmation_requestAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: Pupil_tutoring_interest_confirmation_requestMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: Pupil_tutoring_interest_confirmation_requestMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: Pupil_tutoring_interest_confirmation_requestSumOrderByAggregateInput | undefined;
}
