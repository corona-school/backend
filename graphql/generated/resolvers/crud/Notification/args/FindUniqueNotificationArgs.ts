import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { NotificationWhereUniqueInput } from "../../../inputs/NotificationWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class FindUniqueNotificationArgs {
  @TypeGraphQL.Field(_type => NotificationWhereUniqueInput, {
    nullable: false
  })
  where!: NotificationWhereUniqueInput;
}
