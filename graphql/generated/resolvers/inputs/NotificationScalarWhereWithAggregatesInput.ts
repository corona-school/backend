import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { BoolWithAggregatesFilter } from "../inputs/BoolWithAggregatesFilter";
import { Enumnotification_sender_enumNullableWithAggregatesFilter } from "../inputs/Enumnotification_sender_enumNullableWithAggregatesFilter";
import { IntNullableWithAggregatesFilter } from "../inputs/IntNullableWithAggregatesFilter";
import { IntWithAggregatesFilter } from "../inputs/IntWithAggregatesFilter";
import { StringNullableListFilter } from "../inputs/StringNullableListFilter";
import { StringWithAggregatesFilter } from "../inputs/StringWithAggregatesFilter";

@TypeGraphQL.InputType("NotificationScalarWhereWithAggregatesInput", {
  isAbstract: true
})
export class NotificationScalarWhereWithAggregatesInput {
  @TypeGraphQL.Field(_type => [NotificationScalarWhereWithAggregatesInput], {
    nullable: true
  })
  AND?: NotificationScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [NotificationScalarWhereWithAggregatesInput], {
    nullable: true
  })
  OR?: NotificationScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [NotificationScalarWhereWithAggregatesInput], {
    nullable: true
  })
  NOT?: NotificationScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  id?: IntWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableWithAggregatesFilter, {
    nullable: true
  })
  mailjetTemplateId?: IntNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringWithAggregatesFilter, {
    nullable: true
  })
  description?: StringWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => BoolWithAggregatesFilter, {
    nullable: true
  })
  active?: BoolWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  recipient?: IntWithAggregatesFilter | undefined;

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

  @TypeGraphQL.Field(_type => IntNullableWithAggregatesFilter, {
    nullable: true
  })
  delay?: IntNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntNullableWithAggregatesFilter, {
    nullable: true
  })
  interval?: IntNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => Enumnotification_sender_enumNullableWithAggregatesFilter, {
    nullable: true
  })
  sender?: Enumnotification_sender_enumNullableWithAggregatesFilter | undefined;
}
