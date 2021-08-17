import * as TypeGraphQL from "type-graphql";

export enum SchoolScalarFieldEnum {
  id = "id",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  name = "name",
  website = "website",
  emailDomain = "emailDomain",
  state = "state",
  schooltype = "schooltype",
  activeCooperation = "activeCooperation"
}
TypeGraphQL.registerEnumType(SchoolScalarFieldEnum, {
  name: "SchoolScalarFieldEnum",
  description: undefined,
});
