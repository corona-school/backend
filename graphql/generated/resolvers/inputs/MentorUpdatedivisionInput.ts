import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { mentor_division_enum } from "../../enums/mentor_division_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class MentorUpdatedivisionInput {
  @TypeGraphQL.Field(_type => [mentor_division_enum], {
    nullable: true
  })
  set?: Array<"facebook" | "email" | "events" | "video" | "supervision"> | undefined;

  @TypeGraphQL.Field(_type => [mentor_division_enum], {
    nullable: true
  })
  push?: Array<"facebook" | "email" | "events" | "video" | "supervision"> | undefined;
}
