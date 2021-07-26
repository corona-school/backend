import * as TypeGraphQL from "type-graphql";

export enum MatchScalarFieldEnum {
  id = "id",
  uuid = "uuid",
  dissolved = "dissolved",
  proposedTime = "proposedTime",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  source = "source",
  studentId = "studentId",
  pupilId = "pupilId",
  dissolveReason = "dissolveReason",
  feedbackToPupilMail = "feedbackToPupilMail",
  feedbackToStudentMail = "feedbackToStudentMail",
  followUpToPupilMail = "followUpToPupilMail",
  followUpToStudentMail = "followUpToStudentMail"
}
TypeGraphQL.registerEnumType(MatchScalarFieldEnum, {
  name: "MatchScalarFieldEnum",
  description: undefined,
});
