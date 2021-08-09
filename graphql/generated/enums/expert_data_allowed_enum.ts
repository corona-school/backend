import * as TypeGraphQL from "type-graphql";

export enum expert_data_allowed_enum {
  pending = "pending",
  yes = "yes",
  no = "no"
}
TypeGraphQL.registerEnumType(expert_data_allowed_enum, {
  name: "expert_data_allowed_enum",
  description: undefined,
});
