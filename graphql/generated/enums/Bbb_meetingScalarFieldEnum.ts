import * as TypeGraphQL from "type-graphql";

export enum Bbb_meetingScalarFieldEnum {
  id = "id",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  meetingID = "meetingID",
  meetingName = "meetingName",
  attendeePW = "attendeePW",
  moderatorPW = "moderatorPW",
  alternativeUri = "alternativeUri"
}
TypeGraphQL.registerEnumType(Bbb_meetingScalarFieldEnum, {
  name: "Bbb_meetingScalarFieldEnum",
  description: undefined,
});
