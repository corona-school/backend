import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NotificationCreatecancelledOnActionInput } from "../inputs/NotificationCreatecancelledOnActionInput";
import { NotificationCreatecategoryInput } from "../inputs/NotificationCreatecategoryInput";
import { NotificationCreateonActionsInput } from "../inputs/NotificationCreateonActionsInput";

@TypeGraphQL.InputType("NotificationCreateInput", {
  isAbstract: true
})
export class NotificationCreateInput {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  mailjetTemplateId?: number | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  description!: string;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  active!: boolean;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  recipient!: number;

  @TypeGraphQL.Field(_type => NotificationCreateonActionsInput, {
    nullable: true
  })
  onActions?: NotificationCreateonActionsInput | undefined;

  @TypeGraphQL.Field(_type => NotificationCreatecategoryInput, {
    nullable: true
  })
  category?: NotificationCreatecategoryInput | undefined;

  @TypeGraphQL.Field(_type => NotificationCreatecancelledOnActionInput, {
    nullable: true
  })
  cancelledOnAction?: NotificationCreatecancelledOnActionInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  delay?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  interval?: number | undefined;
}
