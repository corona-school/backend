import * as TypeGraphQL from "type-graphql";

export enum LogScalarFieldEnum {
  id = "id",
  logtype = "logtype",
  createdAt = "createdAt",
  user = "user",
  data = "data"
}
TypeGraphQL.registerEnumType(LogScalarFieldEnum, {
  name: "LogScalarFieldEnum",
  description: undefined,
});
