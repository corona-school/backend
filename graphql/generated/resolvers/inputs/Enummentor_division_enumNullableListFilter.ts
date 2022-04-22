import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { mentor_division_enum } from "../../enums/mentor_division_enum";

@TypeGraphQL.InputType("Enummentor_division_enumNullableListFilter", {
  isAbstract: true
})
export class Enummentor_division_enumNullableListFilter {
  @TypeGraphQL.Field(_type => [mentor_division_enum], {
    nullable: true
  })
  equals?: Array<"facebook" | "email" | "events" | "video" | "supervision"> | undefined;

  @TypeGraphQL.Field(_type => mentor_division_enum, {
    nullable: true
  })
  has?: "facebook" | "email" | "events" | "video" | "supervision" | undefined;

  @TypeGraphQL.Field(_type => [mentor_division_enum], {
    nullable: true
  })
  hasEvery?: Array<"facebook" | "email" | "events" | "video" | "supervision"> | undefined;

  @TypeGraphQL.Field(_type => [mentor_division_enum], {
    nullable: true
  })
  hasSome?: Array<"facebook" | "email" | "events" | "video" | "supervision"> | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  isEmpty?: boolean | undefined;
}
