import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { expert_data_allowed_enum } from "../../enums/expert_data_allowed_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Enumexpert_data_allowed_enumFieldUpdateOperationsInput {
  @TypeGraphQL.Field(_type => expert_data_allowed_enum, {
    nullable: true
  })
  set?: "pending" | "yes" | "no" | undefined;
}
