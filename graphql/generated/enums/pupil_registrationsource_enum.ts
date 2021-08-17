import * as TypeGraphQL from "type-graphql";

export enum pupil_registrationsource_enum {
  normal = "normal",
  cooperation = "cooperation",
  drehtuer = "drehtuer",
  other = "other"
}
TypeGraphQL.registerEnumType(pupil_registrationsource_enum, {
  name: "pupil_registrationsource_enum",
  description: undefined,
});
