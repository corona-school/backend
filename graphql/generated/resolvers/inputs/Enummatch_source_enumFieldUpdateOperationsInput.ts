import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { match_source_enum } from "../../enums/match_source_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Enummatch_source_enumFieldUpdateOperationsInput {
  @TypeGraphQL.Field(_type => match_source_enum, {
    nullable: true
  })
  set?: "imported" | "matchedexternal" | "matchedinternal" | undefined;
}
