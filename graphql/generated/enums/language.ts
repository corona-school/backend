import * as TypeGraphQL from "type-graphql";

export enum language {
  sq = "sq",
  ar = "ar",
  hy = "hy",
  az = "az",
  bs = "bs",
  bg = "bg",
  zh = "zh",
  de = "de",
  en = "en",
  fr = "fr",
  it = "it",
  kk = "kk",
  ku = "ku",
  pl = "pl",
  pt = "pt",
  ru = "ru",
  tr = "tr",
  es = "es",
  uk = "uk",
  vi = "vi",
  other = "other"
}
TypeGraphQL.registerEnumType(language, {
  name: "language",
  description: undefined,
});
