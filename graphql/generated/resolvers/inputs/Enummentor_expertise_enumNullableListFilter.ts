import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { mentor_expertise_enum } from "../../enums/mentor_expertise_enum";

@TypeGraphQL.InputType("Enummentor_expertise_enumNullableListFilter", {
  isAbstract: true
})
export class Enummentor_expertise_enumNullableListFilter {
  @TypeGraphQL.Field(_type => [mentor_expertise_enum], {
    nullable: true
  })
  equals?: Array<"language_difficulties_and_communication" | "specialized_expertise_in_subjects" | "educational_and_didactic_expertise" | "technical_support" | "self_organization"> | undefined;

  @TypeGraphQL.Field(_type => mentor_expertise_enum, {
    nullable: true
  })
  has?: "language_difficulties_and_communication" | "specialized_expertise_in_subjects" | "educational_and_didactic_expertise" | "technical_support" | "self_organization" | undefined;

  @TypeGraphQL.Field(_type => [mentor_expertise_enum], {
    nullable: true
  })
  hasEvery?: Array<"language_difficulties_and_communication" | "specialized_expertise_in_subjects" | "educational_and_didactic_expertise" | "technical_support" | "self_organization"> | undefined;

  @TypeGraphQL.Field(_type => [mentor_expertise_enum], {
    nullable: true
  })
  hasSome?: Array<"language_difficulties_and_communication" | "specialized_expertise_in_subjects" | "educational_and_didactic_expertise" | "technical_support" | "self_organization"> | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  isEmpty?: boolean | undefined;
}
