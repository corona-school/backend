import * as TypeGraphQL from "type-graphql";

export enum Participation_certificateScalarFieldEnum {
  id = "id",
  uuid = "uuid",
  subjects = "subjects",
  categories = "categories",
  certificateDate = "certificateDate",
  startDate = "startDate",
  endDate = "endDate",
  hoursPerWeek = "hoursPerWeek",
  hoursTotal = "hoursTotal",
  medium = "medium",
  ongoingLessons = "ongoingLessons",
  state = "state",
  signaturePupil = "signaturePupil",
  signatureParent = "signatureParent",
  signatureLocation = "signatureLocation",
  signatureDate = "signatureDate",
  studentId = "studentId",
  pupilId = "pupilId"
}
TypeGraphQL.registerEnumType(Participation_certificateScalarFieldEnum, {
  name: "Participation_certificateScalarFieldEnum",
  description: undefined,
});
