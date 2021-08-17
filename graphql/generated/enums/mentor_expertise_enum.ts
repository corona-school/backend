import * as TypeGraphQL from "type-graphql";

export enum mentor_expertise_enum {
  language_difficulties_and_communication = "language_difficulties_and_communication",
  specialized_expertise_in_subjects = "specialized_expertise_in_subjects",
  educational_and_didactic_expertise = "educational_and_didactic_expertise",
  technical_support = "technical_support",
  self_organization = "self_organization"
}
TypeGraphQL.registerEnumType(mentor_expertise_enum, {
  name: "mentor_expertise_enum",
  description: undefined,
});
