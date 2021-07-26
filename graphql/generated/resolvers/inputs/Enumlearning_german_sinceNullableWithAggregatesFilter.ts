import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedEnumlearning_german_sinceNullableFilter } from "../inputs/NestedEnumlearning_german_sinceNullableFilter";
import { NestedEnumlearning_german_sinceNullableWithAggregatesFilter } from "../inputs/NestedEnumlearning_german_sinceNullableWithAggregatesFilter";
import { NestedIntNullableFilter } from "../inputs/NestedIntNullableFilter";
import { learning_german_since } from "../../enums/learning_german_since";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Enumlearning_german_sinceNullableWithAggregatesFilter {
  @TypeGraphQL.Field(_type => learning_german_since, {
    nullable: true
  })
  equals?: "greaterThanFour" | "twoToFour" | "oneToTwo" | "lessThanOne" | undefined;

  @TypeGraphQL.Field(_type => [learning_german_since], {
    nullable: true
  })
  in?: Array<"greaterThanFour" | "twoToFour" | "oneToTwo" | "lessThanOne"> | undefined;

  @TypeGraphQL.Field(_type => [learning_german_since], {
    nullable: true
  })
  notIn?: Array<"greaterThanFour" | "twoToFour" | "oneToTwo" | "lessThanOne"> | undefined;

  @TypeGraphQL.Field(_type => NestedEnumlearning_german_sinceNullableWithAggregatesFilter, {
    nullable: true
  })
  not?: NestedEnumlearning_german_sinceNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => NestedIntNullableFilter, {
    nullable: true
  })
  _count?: NestedIntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumlearning_german_sinceNullableFilter, {
    nullable: true
  })
  _min?: NestedEnumlearning_german_sinceNullableFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumlearning_german_sinceNullableFilter, {
    nullable: true
  })
  _max?: NestedEnumlearning_german_sinceNullableFilter | undefined;
}
