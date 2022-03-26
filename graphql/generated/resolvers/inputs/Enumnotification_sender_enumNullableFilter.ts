import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedEnumnotification_sender_enumNullableFilter } from "../inputs/NestedEnumnotification_sender_enumNullableFilter";
import { notification_sender_enum } from "../../enums/notification_sender_enum";

@TypeGraphQL.InputType("Enumnotification_sender_enumNullableFilter", {
  isAbstract: true
})
export class Enumnotification_sender_enumNullableFilter {
  @TypeGraphQL.Field(_type => notification_sender_enum, {
    nullable: true
  })
  equals?: "SUPPORT" | "CERTIFICATE_OF_CONDUCT" | undefined;

  @TypeGraphQL.Field(_type => [notification_sender_enum], {
    nullable: true
  })
  in?: Array<"SUPPORT" | "CERTIFICATE_OF_CONDUCT"> | undefined;

  @TypeGraphQL.Field(_type => [notification_sender_enum], {
    nullable: true
  })
  notIn?: Array<"SUPPORT" | "CERTIFICATE_OF_CONDUCT"> | undefined;

  @TypeGraphQL.Field(_type => NestedEnumnotification_sender_enumNullableFilter, {
    nullable: true
  })
  not?: NestedEnumnotification_sender_enumNullableFilter | undefined;
}
