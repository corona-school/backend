import * as TypeGraphQL from "type-graphql";

export enum student_registrationsource_enum {
  normal = "normal",
  cooperation = "cooperation",
  drehtuer = "drehtuer",
  other = "other",
  codu = "codu",
  plus = "plus"
}
TypeGraphQL.registerEnumType(student_registrationsource_enum, {
  name: "student_registrationsource_enum",
  description: undefined,
});
