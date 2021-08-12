import * as TypeGraphQL from "type-graphql";

export enum pupil_projectfields_enum {
  Arbeitswelt = "Arbeitswelt",
  Biologie = "Biologie",
  Chemie = "Chemie",
  Geo_und_Raumwissenschaften = "Geo_und_Raumwissenschaften",
  Mathematik_Informatik = "Mathematik_Informatik",
  Physik = "Physik",
  Technik = "Technik"
}
TypeGraphQL.registerEnumType(pupil_projectfields_enum, {
  name: "pupil_projectfields_enum",
  description: undefined,
});
