import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { NotificationWhereInput } from "../../../inputs/NotificationWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyNotificationArgs {
  @TypeGraphQL.Field(_type => NotificationWhereInput, {
    nullable: true
  })
  where?: NotificationWhereInput | undefined;
}
