import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { NotificationOrderByWithRelationInput } from "../../../inputs/NotificationOrderByWithRelationInput";
import { NotificationWhereInput } from "../../../inputs/NotificationWhereInput";
import { NotificationWhereUniqueInput } from "../../../inputs/NotificationWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregateNotificationArgs {
  @TypeGraphQL.Field(_type => NotificationWhereInput, {
    nullable: true
  })
  where?: NotificationWhereInput | undefined;

  @TypeGraphQL.Field(_type => [NotificationOrderByWithRelationInput], {
    nullable: true
  })
  orderBy?: NotificationOrderByWithRelationInput[] | undefined;

  @TypeGraphQL.Field(_type => NotificationWhereUniqueInput, {
    nullable: true
  })
  cursor?: NotificationWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
