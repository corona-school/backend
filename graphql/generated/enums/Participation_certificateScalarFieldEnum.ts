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
  studentId = "studentId",
  pupilId = "pupilId",
  ongoingLessons = "ongoingLessons"
}
TypeGraphQL.registerEnumType(Participation_certificateScalarFieldEnum, {
  name: "Participation_certificateScalarFieldEnum",
  description: undefined,
});
