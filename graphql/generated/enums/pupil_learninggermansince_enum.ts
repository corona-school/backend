import * as TypeGraphQL from "type-graphql";

export enum pupil_learninggermansince_enum {
  more_than_four = "more_than_four",
  two_to_four = "two_to_four",
  one_to_two = "one_to_two",
  less_than_one = "less_than_one"
}
TypeGraphQL.registerEnumType(pupil_learninggermansince_enum, {
  name: "pupil_learninggermansince_enum",
  description: undefined,
});
