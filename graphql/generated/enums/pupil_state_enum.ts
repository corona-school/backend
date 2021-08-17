import * as TypeGraphQL from "type-graphql";

export enum pupil_state_enum {
  bw = "bw",
  by = "by",
  be = "be",
  bb = "bb",
  hb = "hb",
  hh = "hh",
  he = "he",
  mv = "mv",
  ni = "ni",
  nw = "nw",
  rp = "rp",
  sl = "sl",
  sn = "sn",
  st = "st",
  sh = "sh",
  th = "th",
  other = "other"
}
TypeGraphQL.registerEnumType(pupil_state_enum, {
  name: "pupil_state_enum",
  description: undefined,
});
