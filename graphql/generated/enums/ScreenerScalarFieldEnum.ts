import * as TypeGraphQL from "type-graphql";

export enum ScreenerScalarFieldEnum {
  id = "id",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  firstname = "firstname",
  lastname = "lastname",
  active = "active",
  email = "email",
  verification = "verification",
  verifiedAt = "verifiedAt",
  authToken = "authToken",
  authTokenUsed = "authTokenUsed",
  authTokenSent = "authTokenSent",
  password = "password",
  verified = "verified",
  oldNumberID = "oldNumberID"
}
TypeGraphQL.registerEnumType(ScreenerScalarFieldEnum, {
  name: "ScreenerScalarFieldEnum",
  description: undefined,
});
