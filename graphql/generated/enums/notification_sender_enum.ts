import * as TypeGraphQL from "type-graphql";

export enum notification_sender_enum {
  SUPPORT = "SUPPORT",
  CERTIFICATE_OF_CONDUCT = "CERTIFICATE_OF_CONDUCT"
}
TypeGraphQL.registerEnumType(notification_sender_enum, {
  name: "notification_sender_enum",
  description: undefined,
});
