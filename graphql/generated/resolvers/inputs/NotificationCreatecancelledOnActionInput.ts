import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";

@TypeGraphQL.InputType("NotificationCreatecancelledOnActionInput", {
  isAbstract: true
})
export class NotificationCreatecancelledOnActionInput {
  @TypeGraphQL.Field(_type => [String], {
    nullable: false
  })
  set!: string[];
}
