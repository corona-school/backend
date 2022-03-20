import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";

@TypeGraphQL.InputType("NullableBoolFieldUpdateOperationsInput", {
  isAbstract: true
})
export class NullableBoolFieldUpdateOperationsInput {
  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  set?: boolean | undefined;
}
