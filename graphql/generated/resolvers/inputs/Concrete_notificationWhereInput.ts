import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { DateTimeFilter } from "../inputs/DateTimeFilter";
import { IntFilter } from "../inputs/IntFilter";
import { JsonFilter } from "../inputs/JsonFilter";
import { StringFilter } from "../inputs/StringFilter";
import { StringNullableFilter } from "../inputs/StringNullableFilter";

@TypeGraphQL.InputType("Concrete_notificationWhereInput", {
  isAbstract: true
})
export class Concrete_notificationWhereInput {
  @TypeGraphQL.Field(_type => [Concrete_notificationWhereInput], {
    nullable: true
  })
  AND?: Concrete_notificationWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Concrete_notificationWhereInput], {
    nullable: true
  })
  OR?: Concrete_notificationWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => [Concrete_notificationWhereInput], {
    nullable: true
  })
  NOT?: Concrete_notificationWhereInput[] | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  id?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => StringFilter, {
    nullable: true
  })
  userId?: StringFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  notificationID?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  contextID?: StringNullableFilter | undefined;

  @TypeGraphQL.Field(_type => JsonFilter, {
    nullable: true
  })
  context?: JsonFilter | undefined;

  @TypeGraphQL.Field(_type => DateTimeFilter, {
    nullable: true
  })
  sentAt?: DateTimeFilter | undefined;

  @TypeGraphQL.Field(_type => IntFilter, {
    nullable: true
  })
  state?: IntFilter | undefined;

  @TypeGraphQL.Field(_type => StringNullableFilter, {
    nullable: true
  })
  error?: StringNullableFilter | undefined;
}
