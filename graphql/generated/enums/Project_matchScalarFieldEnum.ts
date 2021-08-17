import * as TypeGraphQL from "type-graphql";

export enum Project_matchScalarFieldEnum {
  id = "id",
  uuid = "uuid",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  dissolved = "dissolved",
  dissolveReason = "dissolveReason",
  studentId = "studentId",
  pupilId = "pupilId"
}
TypeGraphQL.registerEnumType(Project_matchScalarFieldEnum, {
  name: "Project_matchScalarFieldEnum",
  description: undefined,
});
