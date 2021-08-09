import * as TypeGraphQL from "type-graphql";

export enum Course_attendance_logScalarFieldEnum {
  id = "id",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  attendedTime = "attendedTime",
  ip = "ip",
  pupilId = "pupilId",
  lectureId = "lectureId"
}
TypeGraphQL.registerEnumType(Course_attendance_logScalarFieldEnum, {
  name: "Course_attendance_logScalarFieldEnum",
  description: undefined,
});
