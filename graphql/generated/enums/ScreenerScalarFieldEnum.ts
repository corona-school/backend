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
  password = "password",
  verified = "verified",
  oldNumberID = "oldNumberID",
  verifiedAt = "verifiedAt",
  authToken = "authToken",
  authTokenUsed = "authTokenUsed",
  authTokenSent = "authTokenSent"
}
TypeGraphQL.registerEnumType(ScreenerScalarFieldEnum, {
  name: "ScreenerScalarFieldEnum",
  description: undefined,
});
