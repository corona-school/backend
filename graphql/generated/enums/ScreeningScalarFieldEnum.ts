import * as TypeGraphQL from "type-graphql";

export enum ScreeningScalarFieldEnum {
  id = "id",
  success = "success",
  comment = "comment",
  knowsCoronaSchoolFrom = "knowsCoronaSchoolFrom",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  screenerId = "screenerId",
  studentId = "studentId"
}
TypeGraphQL.registerEnumType(ScreeningScalarFieldEnum, {
  name: "ScreeningScalarFieldEnum",
  description: undefined,
});
