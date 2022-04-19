import * as TypeGraphQL from "type-graphql";

export enum MatchScalarFieldEnum {
  id = "id",
  uuid = "uuid",
  dissolved = "dissolved",
  dissolveReason = "dissolveReason",
  proposedTime = "proposedTime",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  feedbackToPupilMail = "feedbackToPupilMail",
  feedbackToStudentMail = "feedbackToStudentMail",
  followUpToPupilMail = "followUpToPupilMail",
  followUpToStudentMail = "followUpToStudentMail",
  source = "source",
  matchPool = "matchPool",
  studentId = "studentId",
  pupilId = "pupilId"
}
TypeGraphQL.registerEnumType(MatchScalarFieldEnum, {
  name: "MatchScalarFieldEnum",
  description: undefined,
});
