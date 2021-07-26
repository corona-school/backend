import * as TypeGraphQL from "type-graphql";

export enum student_module_enum {
  internship = "internship",
  seminar = "seminar",
  other = "other"
}
TypeGraphQL.registerEnumType(student_module_enum, {
  name: "student_module_enum",
  description: undefined,
});
