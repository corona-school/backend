import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { NotificationUpdateInput } from "../../../inputs/NotificationUpdateInput";
import { NotificationWhereUniqueInput } from "../../../inputs/NotificationWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateNotificationArgs {
  @TypeGraphQL.Field(_type => NotificationUpdateInput, {
    nullable: false
  })
  data!: NotificationUpdateInput;

  @TypeGraphQL.Field(_type => NotificationWhereUniqueInput, {
    nullable: false
  })
  where!: NotificationWhereUniqueInput;
}
