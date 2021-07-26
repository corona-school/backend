import * as TypeGraphQL from "type-graphql";

export enum learning_german_since {
  greaterThanFour = "greaterThanFour",
  twoToFour = "twoToFour",
  oneToTwo = "oneToTwo",
  lessThanOne = "lessThanOne"
}
TypeGraphQL.registerEnumType(learning_german_since, {
  name: "learning_german_since",
  description: undefined,
});
