import * as TypeGraphQL from "type-graphql";

export enum Course_guestScalarFieldEnum {
  id = "id",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
  token = "token",
  firstname = "firstname",
  lastname = "lastname",
  email = "email",
  courseId = "courseId",
  inviterId = "inviterId"
}
TypeGraphQL.registerEnumType(Course_guestScalarFieldEnum, {
  name: "Course_guestScalarFieldEnum",
  description: undefined,
});
