import * as TypeGraphQL from "type-graphql";

export enum LectureScalarFieldEnum {
  id = "id",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  start = "start",
  duration = "duration",
  instructorId = "instructorId",
  subcourseId = "subcourseId"
}
TypeGraphQL.registerEnumType(LectureScalarFieldEnum, {
  name: "LectureScalarFieldEnum",
  description: undefined,
});
