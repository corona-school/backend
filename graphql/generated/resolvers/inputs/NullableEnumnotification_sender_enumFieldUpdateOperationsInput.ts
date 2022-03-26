import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { notification_sender_enum } from "../../enums/notification_sender_enum";

@TypeGraphQL.InputType("NullableEnumnotification_sender_enumFieldUpdateOperationsInput", {
  isAbstract: true
})
export class NullableEnumnotification_sender_enumFieldUpdateOperationsInput {
  @TypeGraphQL.Field(_type => notification_sender_enum, {
    nullable: true
  })
  set?: "SUPPORT" | "CERTIFICATE_OF_CONDUCT" | undefined;
}
