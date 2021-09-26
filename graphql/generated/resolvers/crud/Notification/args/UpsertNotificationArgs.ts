import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { NotificationCreateInput } from "../../../inputs/NotificationCreateInput";
import { NotificationUpdateInput } from "../../../inputs/NotificationUpdateInput";
import { NotificationWhereUniqueInput } from "../../../inputs/NotificationWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertNotificationArgs {
  @TypeGraphQL.Field(_type => NotificationWhereUniqueInput, {
    nullable: false
  })
  where!: NotificationWhereUniqueInput;

  @TypeGraphQL.Field(_type => NotificationCreateInput, {
    nullable: false
  })
  create!: NotificationCreateInput;

  @TypeGraphQL.Field(_type => NotificationUpdateInput, {
    nullable: false
  })
  update!: NotificationUpdateInput;
}
