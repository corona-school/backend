import * as TypeGraphQL from "type-graphql";

export enum CourseScalarFieldEnum {
  id = "id",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  name = "name",
  outline = "outline",
  description = "description",
  imageKey = "imageKey",
  category = "category",
  courseState = "courseState",
  screeningComment = "screeningComment",
  publicRanking = "publicRanking",
  allowContact = "allowContact",
  correspondentId = "correspondentId"
}
TypeGraphQL.registerEnumType(CourseScalarFieldEnum, {
  name: "CourseScalarFieldEnum",
  description: undefined,
});
