import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { NotificationUpdateManyMutationInput } from "../../../inputs/NotificationUpdateManyMutationInput";
import { NotificationWhereInput } from "../../../inputs/NotificationWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyNotificationArgs {
  @TypeGraphQL.Field(_type => NotificationUpdateManyMutationInput, {
    nullable: false
  })
  data!: NotificationUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => NotificationWhereInput, {
    nullable: true
  })
  where?: NotificationWhereInput | undefined;
}
