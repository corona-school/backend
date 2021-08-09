import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedEnummatch_source_enumFilter } from "../inputs/NestedEnummatch_source_enumFilter";
import { NestedIntFilter } from "../inputs/NestedIntFilter";
import { match_source_enum } from "../../enums/match_source_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class NestedEnummatch_source_enumWithAggregatesFilter {
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

  @TypeGraphQL.Field(_type => NestedEnummatch_source_enumWithAggregatesFilter, {
    nullable: true
  })
  not?: NestedEnummatch_source_enumWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => NestedIntFilter, {
    nullable: true
  })
  _count?: NestedIntFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnummatch_source_enumFilter, {
    nullable: true
  })
  _min?: NestedEnummatch_source_enumFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnummatch_source_enumFilter, {
    nullable: true
  })
  _max?: NestedEnummatch_source_enumFilter | undefined;
}
