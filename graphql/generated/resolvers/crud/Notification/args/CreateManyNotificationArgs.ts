import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { NotificationCreateManyInput } from "../../../inputs/NotificationCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyNotificationArgs {
  @TypeGraphQL.Field(_type => [NotificationCreateManyInput], {
    nullable: false
  })
  data!: NotificationCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
