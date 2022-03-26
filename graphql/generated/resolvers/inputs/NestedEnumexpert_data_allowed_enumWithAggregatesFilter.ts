import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedEnumexpert_data_allowed_enumFilter } from "../inputs/NestedEnumexpert_data_allowed_enumFilter";
import { NestedIntFilter } from "../inputs/NestedIntFilter";
import { expert_data_allowed_enum } from "../../enums/expert_data_allowed_enum";

@TypeGraphQL.InputType("NestedEnumexpert_data_allowed_enumWithAggregatesFilter", {
  isAbstract: true
})
export class NestedEnumexpert_data_allowed_enumWithAggregatesFilter {
  @TypeGraphQL.Field(_type => expert_data_allowed_enum, {
    nullable: true
  })
  equals?: "pending" | "yes" | "no" | undefined;

  @TypeGraphQL.Field(_type => [expert_data_allowed_enum], {
    nullable: true
  })
  in?: Array<"pending" | "yes" | "no"> | undefined;

  @TypeGraphQL.Field(_type => [expert_data_allowed_enum], {
    nullable: true
  })
  notIn?: Array<"pending" | "yes" | "no"> | undefined;

  @TypeGraphQL.Field(_type => NestedEnumexpert_data_allowed_enumWithAggregatesFilter, {
    nullable: true
  })
  not?: NestedEnumexpert_data_allowed_enumWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => NestedIntFilter, {
    nullable: true
  })
  _count?: NestedIntFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumexpert_data_allowed_enumFilter, {
    nullable: true
  })
  _min?: NestedEnumexpert_data_allowed_enumFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumexpert_data_allowed_enumFilter, {
    nullable: true
  })
  _max?: NestedEnumexpert_data_allowed_enumFilter | undefined;
}
