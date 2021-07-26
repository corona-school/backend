import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { learning_german_since } from "../../enums/learning_german_since";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class NestedEnumlearning_german_sinceNullableFilter {
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

  @TypeGraphQL.Field(_type => NestedEnumlearning_german_sinceNullableFilter, {
    nullable: true
  })
  not?: NestedEnumlearning_german_sinceNullableFilter | undefined;
}
