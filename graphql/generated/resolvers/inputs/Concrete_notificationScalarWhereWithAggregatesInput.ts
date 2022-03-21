import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { DateTimeWithAggregatesFilter } from "../inputs/DateTimeWithAggregatesFilter";
import { IntWithAggregatesFilter } from "../inputs/IntWithAggregatesFilter";
import { JsonWithAggregatesFilter } from "../inputs/JsonWithAggregatesFilter";
import { StringNullableWithAggregatesFilter } from "../inputs/StringNullableWithAggregatesFilter";
import { StringWithAggregatesFilter } from "../inputs/StringWithAggregatesFilter";

@TypeGraphQL.InputType("Concrete_notificationScalarWhereWithAggregatesInput", {
  isAbstract: true
})
export class Concrete_notificationScalarWhereWithAggregatesInput {
  @TypeGraphQL.Field(_type => [Concrete_notificationScalarWhereWithAggregatesInput], {
    nullable: true
  })
  AND?: Concrete_notificationScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Concrete_notificationScalarWhereWithAggregatesInput], {
    nullable: true
  })
  OR?: Concrete_notificationScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => [Concrete_notificationScalarWhereWithAggregatesInput], {
    nullable: true
  })
  NOT?: Concrete_notificationScalarWhereWithAggregatesInput[] | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  id?: IntWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringWithAggregatesFilter, {
    nullable: true
  })
  userId?: StringWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  notificationID?: IntWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableWithAggregatesFilter, {
    nullable: true
  })
  contextID?: StringNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => JsonWithAggregatesFilter, {
    nullable: true
  })
  context?: JsonWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeWithAggregatesFilter, {
    nullable: true
  })
  sentAt?: DateTimeWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => IntWithAggregatesFilter, {
    nullable: true
  })
  state?: IntWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableWithAggregatesFilter, {
    nullable: true
  })
  error?: StringNullableWithAggregatesFilter | undefined;
}
