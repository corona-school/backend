import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { match_source_enum } from "../../enums/match_source_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class NestedEnummatch_source_enumFilter {
  @TypeGraphQL.Field(_type => match_source_enum, {
    nullable: true
  })
  equals?: "imported" | "matchedexternal" | "matchedinternal" | undefined;

  @TypeGraphQL.Field(_type => [match_source_enum], {
    nullable: true
  })
  in?: Array<"imported" | "matchedexternal" | "matchedinternal"> | undefined;

  @TypeGraphQL.Field(_type => [match_source_enum], {
    nullable: true
  })
  notIn?: Array<"imported" | "matchedexternal" | "matchedinternal"> | undefined;

  @TypeGraphQL.Field(_type => NestedEnummatch_source_enumFilter, {
    nullable: true
  })
  not?: NestedEnummatch_source_enumFilter | undefined;
}
