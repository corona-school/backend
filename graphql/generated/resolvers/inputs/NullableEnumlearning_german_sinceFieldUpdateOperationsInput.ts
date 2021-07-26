import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { learning_german_since } from "../../enums/learning_german_since";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class NullableEnumlearning_german_sinceFieldUpdateOperationsInput {
  @TypeGraphQL.Field(_type => learning_german_since, {
    nullable: true
  })
  set?: "greaterThanFour" | "twoToFour" | "oneToTwo" | "lessThanOne" | undefined;
}
