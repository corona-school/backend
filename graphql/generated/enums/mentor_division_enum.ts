import * as TypeGraphQL from "type-graphql";

export enum mentor_division_enum {
  facebook = "facebook",
  email = "email",
  events = "events",
  video = "video",
  supervision = "supervision"
}
TypeGraphQL.registerEnumType(mentor_division_enum, {
  name: "mentor_division_enum",
  description: undefined,
});
