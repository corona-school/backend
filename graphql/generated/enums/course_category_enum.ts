import * as TypeGraphQL from "type-graphql";

export enum course_category_enum {
  revision = "revision",
  club = "club",
  coaching = "coaching"
}
TypeGraphQL.registerEnumType(course_category_enum, {
  name: "course_category_enum",
  description: undefined,
});
