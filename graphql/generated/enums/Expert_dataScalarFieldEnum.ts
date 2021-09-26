import * as TypeGraphQL from "type-graphql";

export enum Expert_dataScalarFieldEnum {
  id = "id",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  contactEmail = "contactEmail",
  description = "description",
  active = "active",
  allowed = "allowed",
  studentId = "studentId"
}
TypeGraphQL.registerEnumType(Expert_dataScalarFieldEnum, {
  name: "Expert_dataScalarFieldEnum",
  description: undefined,
});
