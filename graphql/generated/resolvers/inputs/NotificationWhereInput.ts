import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BoolFilter } from "../inputs/BoolFilter";
import { Enumnotification_sender_enumNullableFilter } from "../inputs/Enumnotification_sender_enumNullableFilter";
import { IntFilter } from "../inputs/IntFilter";
import { IntNullableFilter } from "../inputs/IntNullableFilter";
import { StringFilter } from "../inputs/StringFilter";
import { StringNullableListFilter } from "../inputs/StringNullableListFilter";

@TypeGraphQL.InputType("NotificationWhereInput", {
  isAbstract: true
})
export class NotificationWhereInput {
  @TypeGraphQL.Field(_type => [NotificationWhereInput], {
    nullable: true
  })
  AND?: NotificationWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [NotificationWhereInput], {
    nullable: true
  })
  OR?: NotificationWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [NotificationWhereInput], {
    nullable: true
  })
  NOT?: NotificationWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  id?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true
  })
  mailjetTemplateId?: IntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  description?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => BoolFilter, {
    nullable: true
  })
  active?: BoolFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  recipient?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableListFilter, {
    nullable: true
  })
  onActions?: StringNullableListFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableListFilter, {
    nullable: true
  })
  category?: StringNullableListFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableListFilter, {
    nullable: true
  })
  cancelledOnAction?: StringNullableListFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true
  })
  delay?: IntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableFilter, {
    nullable: true
  })
  interval?: IntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => Enumnotification_sender_enumNullableFilter, {
    nullable: true
  })
  sender?: Enumnotification_sender_enumNullableFilter | undefined;
}
