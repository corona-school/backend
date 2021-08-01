import * as TypeGraphQL from "type-graphql";

export enum NotificationScalarFieldEnum {
  id = "id",
  mailjetTemplateId = "mailjetTemplateId",
  description = "description",
  active = "active",
  recipient = "recipient",
  onActions = "onActions",
  category = "category",
  cancelledOnAction = "cancelledOnAction",
  delay = "delay",
  interval = "interval"
}
TypeGraphQL.registerEnumType(NotificationScalarFieldEnum, {
  name: "NotificationScalarFieldEnum",
  description: undefined,
});
