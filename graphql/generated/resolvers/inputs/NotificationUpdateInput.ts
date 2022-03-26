import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BoolFieldUpdateOperationsInput } from "../inputs/BoolFieldUpdateOperationsInput";
import { IntFieldUpdateOperationsInput } from "../inputs/IntFieldUpdateOperationsInput";
import { NotificationUpdatecancelledOnActionInput } from "../inputs/NotificationUpdatecancelledOnActionInput";
import { NotificationUpdatecategoryInput } from "../inputs/NotificationUpdatecategoryInput";
import { NotificationUpdateonActionsInput } from "../inputs/NotificationUpdateonActionsInput";
import { NullableIntFieldUpdateOperationsInput } from "../inputs/NullableIntFieldUpdateOperationsInput";
import { StringFieldUpdateOperationsInput } from "../inputs/StringFieldUpdateOperationsInput";

@TypeGraphQL.InputType("NotificationUpdateInput", {
  isAbstract: true
})
export class NotificationUpdateInput {
  @TypeGraphQL.Field(_type => NullableIntFieldUpdateOperationsInput, {
    nullable: true
  })
  mailjetTemplateId?: NullableIntFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => StringFieldUpdateOperationsInput, {
    nullable: true
  })
  description?: StringFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => BoolFieldUpdateOperationsInput, {
    nullable: true
  })
  active?: BoolFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => IntFieldUpdateOperationsInput, {
    nullable: true
  })
  recipient?: IntFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NotificationUpdateonActionsInput, {
    nullable: true
  })
  onActions?: NotificationUpdateonActionsInput | undefined;

  @TypeGraphQL.Field(_type => NotificationUpdatecategoryInput, {
    nullable: true
  })
  category?: NotificationUpdatecategoryInput | undefined;

  @TypeGraphQL.Field(_type => NotificationUpdatecancelledOnActionInput, {
    nullable: true
  })
  cancelledOnAction?: NotificationUpdatecancelledOnActionInput | undefined;

  @TypeGraphQL.Field(_type => NullableIntFieldUpdateOperationsInput, {
    nullable: true
  })
  delay?: NullableIntFieldUpdateOperationsInput | undefined;

  @TypeGraphQL.Field(_type => NullableIntFieldUpdateOperationsInput, {
    nullable: true
  })
  interval?: NullableIntFieldUpdateOperationsInput | undefined;
}
