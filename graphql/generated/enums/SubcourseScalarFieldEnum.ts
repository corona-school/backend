import * as TypeGraphQL from "type-graphql";

export enum SubcourseScalarFieldEnum {
  id = "id",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  minGrade = "minGrade",
  maxGrade = "maxGrade",
  maxParticipants = "maxParticipants",
  published = "published",
  cancelled = "cancelled",
  joinAfterStart = "joinAfterStart",
  courseId = "courseId"
}
TypeGraphQL.registerEnumType(SubcourseScalarFieldEnum, {
  name: "SubcourseScalarFieldEnum",
  description: undefined,
});
