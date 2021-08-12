import * as TypeGraphQL from "type-graphql";

export enum school_schooltype_enum {
  grundschule = "grundschule",
  gesamtschule = "gesamtschule",
  hauptschule = "hauptschule",
  realschule = "realschule",
  gymnasium = "gymnasium",
  f_rderschule = "f_rderschule",
  berufsschule = "berufsschule",
  other = "other"
}
TypeGraphQL.registerEnumType(school_schooltype_enum, {
  name: "school_schooltype_enum",
  description: undefined,
});
