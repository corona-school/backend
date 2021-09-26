import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { mentor_division_enum } from "../../enums/mentor_division_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class MentorCreateManydivisionInput {
  @TypeGraphQL.Field(_type => [mentor_division_enum], {
    nullable: false
  })
  set!: Array<"facebook" | "email" | "events" | "video" | "supervision">;
}
