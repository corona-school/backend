import * as TypeGraphQL from "type-graphql";

export enum pupil_schooltype_enum {
  grundschule = "grundschule",
  gesamtschule = "gesamtschule",
  hauptschule = "hauptschule",
  realschule = "realschule",
  gymnasium = "gymnasium",
  f_rderschule = "f_rderschule",
  berufsschule = "berufsschule",
  other = "other"
}
TypeGraphQL.registerEnumType(pupil_schooltype_enum, {
  name: "pupil_schooltype_enum",
  description: undefined,
});
