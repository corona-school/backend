import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Certificate_of_conductAvgOrderByAggregateInput } from "../inputs/Certificate_of_conductAvgOrderByAggregateInput";
import { Certificate_of_conductCountOrderByAggregateInput } from "../inputs/Certificate_of_conductCountOrderByAggregateInput";
import { Certificate_of_conductMaxOrderByAggregateInput } from "../inputs/Certificate_of_conductMaxOrderByAggregateInput";
import { Certificate_of_conductMinOrderByAggregateInput } from "../inputs/Certificate_of_conductMinOrderByAggregateInput";
import { Certificate_of_conductSumOrderByAggregateInput } from "../inputs/Certificate_of_conductSumOrderByAggregateInput";
import { SortOrder } from "../../enums/SortOrder";

@TypeGraphQL.InputType("Certificate_of_conductOrderByWithAggregationInput", {
  isAbstract: true
})
export class Certificate_of_conductOrderByWithAggregationInput {
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
  dateOfInspection?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  dateOfIssue?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  criminalRecords?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => SortOrder, {
    nullable: true
  })
  studentId?: "asc" | "desc" | undefined;

  @TypeGraphQL.Field(_type => Certificate_of_conductCountOrderByAggregateInput, {
    nullable: true
  })
  _count?: Certificate_of_conductCountOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Certificate_of_conductAvgOrderByAggregateInput, {
    nullable: true
  })
  _avg?: Certificate_of_conductAvgOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Certificate_of_conductMaxOrderByAggregateInput, {
    nullable: true
  })
  _max?: Certificate_of_conductMaxOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Certificate_of_conductMinOrderByAggregateInput, {
    nullable: true
  })
  _min?: Certificate_of_conductMinOrderByAggregateInput | undefined;

  @TypeGraphQL.Field(_type => Certificate_of_conductSumOrderByAggregateInput, {
    nullable: true
  })
  _sum?: Certificate_of_conductSumOrderByAggregateInput | undefined;
}
