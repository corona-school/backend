import * as TypeGraphQL from "type-graphql";

export enum pupil_languages_enum {
  Albanisch = "Albanisch",
  Arabisch = "Arabisch",
  Armenisch = "Armenisch",
  Aserbaidschanisch = "Aserbaidschanisch",
  Bosnisch = "Bosnisch",
  Bulgarisch = "Bulgarisch",
  Chinesisch = "Chinesisch",
  Deutsch = "Deutsch",
  Englisch = "Englisch",
  Franz_sisch = "Franz_sisch",
  Italienisch = "Italienisch",
  Kasachisch = "Kasachisch",
  Kurdisch = "Kurdisch",
  Polnisch = "Polnisch",
  Portugiesisch = "Portugiesisch",
  Russisch = "Russisch",
  T_rkisch = "T_rkisch",
  Spanisch = "Spanisch",
  Ukrainisch = "Ukrainisch",
  Vietnamesisch = "Vietnamesisch",
  Andere = "Andere"
}
TypeGraphQL.registerEnumType(pupil_languages_enum, {
  name: "pupil_languages_enum",
  description: undefined,
});
