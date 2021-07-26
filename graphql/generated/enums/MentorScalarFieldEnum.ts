import * as TypeGraphQL from "type-graphql";

export enum MentorScalarFieldEnum {
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
  division = "division",
  expertise = "expertise",
  subjects = "subjects",
  teachingExperience = "teachingExperience",
  message = "message",
  description = "description",
  imageUrl = "imageUrl",
  wix_id = "wix_id",
  wix_creation_date = "wix_creation_date"
}
TypeGraphQL.registerEnumType(MentorScalarFieldEnum, {
  name: "MentorScalarFieldEnum",
  description: undefined,
});
