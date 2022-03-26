import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NotificationCreateManycancelledOnActionInput } from "../inputs/NotificationCreateManycancelledOnActionInput";
import { NotificationCreateManycategoryInput } from "../inputs/NotificationCreateManycategoryInput";
import { NotificationCreateManyonActionsInput } from "../inputs/NotificationCreateManyonActionsInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class NotificationCreateManyInput {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  id?: number | undefined;

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

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  delay?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  interval?: number | undefined;

  @TypeGraphQL.Field(_type => NotificationCreateManyonActionsInput, {
    nullable: true
  })
  onActions?: NotificationCreateManyonActionsInput | undefined;

  @TypeGraphQL.Field(_type => NotificationCreateManycategoryInput, {
    nullable: true
  })
  category?: NotificationCreateManycategoryInput | undefined;

  @TypeGraphQL.Field(_type => NotificationCreateManycancelledOnActionInput, {
    nullable: true
  })
  cancelledOnAction?: NotificationCreateManycancelledOnActionInput | undefined;
}
