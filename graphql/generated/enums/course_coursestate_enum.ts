import * as TypeGraphQL from "type-graphql";

export enum course_coursestate_enum {
  created = "created",
  submitted = "submitted",
  allowed = "allowed",
  denied = "denied",
  cancelled = "cancelled"
}
TypeGraphQL.registerEnumType(course_coursestate_enum, {
  name: "course_coursestate_enum",
  description: undefined,
});
