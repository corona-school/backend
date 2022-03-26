import * as TypeGraphQL from "type-graphql";

export enum SecretScalarFieldEnum {
  id = "id",
  createdAt = "createdAt",
  userId = "userId",
  type = "type",
  secret = "secret",
  expiresAt = "expiresAt",
  lastUsed = "lastUsed"
}
TypeGraphQL.registerEnumType(SecretScalarFieldEnum, {
  name: "SecretScalarFieldEnum",
  description: undefined,
});
