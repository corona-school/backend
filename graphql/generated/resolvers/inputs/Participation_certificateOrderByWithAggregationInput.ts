import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Participation_certificateAvgOrderByAggregateInput } from "../inputs/Participation_certificateAvgOrderByAggregateInput";
import { Participation_certificateCountOrderByAggregateInput } from "../inputs/Participation_certificateCountOrderByAggregateInput";
import { Participation_certificateMaxOrderByAggregateInput } from "../inputs/Participation_certificateMaxOrderByAggregateInput";
import { Participation_certificateMinOrderByAggregateInput } from "../inputs/Participation_certificateMinOrderByAggregateInput";
import { Participation_certificateSumOrderByAggregateInput } from "../inputs/Participation_certificateSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("Participation_certificateOrderByWithAggregationInput", {
  isAbstract: true
})
export class Participation_certificateOrderByWithAggregationInput {
  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  id?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  uuid?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  subjects?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  categories?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  certificateDate?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  startDate?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  endDate?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  hoursPerWeek?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  hoursTotal?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  medium?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  ongoingLessons?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  state?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  signaturePupil?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  signatureParent?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  signatureLocation?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  signatureDate?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  studentId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  pupilId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => Participation_certificateCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: Participation_certificateCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Participation_certificateAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: Participation_certificateAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Participation_certificateMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: Participation_certificateMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Participation_certificateMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: Participation_certificateMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Participation_certificateSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: Participation_certificateSumOrderByAggregateInput | undefined;
}
