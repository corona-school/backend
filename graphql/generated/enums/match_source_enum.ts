import * as TypeGraphQL from "type-graphql";

export enum match_source_enum {
  imported = "imported",
  matchedexternal = "matchedexternal",
  matchedinternal = "matchedinternal"
}
TypeGraphQL.registerEnumType(match_source_enum, {
  name: "match_source_enum",
  description: undefined,
});
