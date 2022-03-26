import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { NotificationOrderByInput } from "../../../inputs/NotificationOrderByInput";
import { NotificationWhereInput } from "../../../inputs/NotificationWhereInput";
import { NotificationWhereUniqueInput } from "../../../inputs/NotificationWhereUniqueInput";
import { NotificationScalarFieldEnum } from "../../../../enums/NotificationScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class FindManyNotificationArgs {
  @TypeGraphQL.Field(_type => NotificationWhereInput, {
    nullable: true
  })
  where?: NotificationWhereInput | undefined;

  @TypeGraphQL.Field(_type => [NotificationOrderByInput], {
    nullable: true
  })
  orderBy?: NotificationOrderByInput[] | undefined;

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

  @TypeGraphQL.Field(_type => [NotificationScalarFieldEnum], {
    nullable: true
  })
  distinct?: Array<"id" | "mailjetTemplateId" | "description" | "active" | "recipient" | "onActions" | "category" | "cancelledOnAction" | "delay" | "interval"> | undefined;
}
