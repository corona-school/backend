import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedEnumnotification_sender_enumNullableFilter } from "../inputs/NestedEnumnotification_sender_enumNullableFilter";
import { NestedIntNullableFilter } from "../inputs/NestedIntNullableFilter";
import { notification_sender_enum } from "../../enums/notification_sender_enum";

@TypeGraphQL.InputType("NestedEnumnotification_sender_enumNullableWithAggregatesFilter", {
  isAbstract: true
})
export class NestedEnumnotification_sender_enumNullableWithAggregatesFilter {
  @TypeGraphQL.Field(_type => notification_sender_enum, {
    nullable: true
  })
  equals?: "SUPPORT" | "CERTIFICATE_OF_CONDUCT" | undefined;

  @TypeGraphQL.Field(_type => [notification_sender_enum], {
    nullable: true
  })
  in?: Array<"SUPPORT" | "CERTIFICATE_OF_CONDUCT"> | undefined;

  @TypeGraphQL.Field(_type => [notification_sender_enum], {
    nullable: true
  })
  notIn?: Array<"SUPPORT" | "CERTIFICATE_OF_CONDUCT"> | undefined;

  @TypeGraphQL.Field(_type => NestedEnumnotification_sender_enumNullableWithAggregatesFilter, {
    nullable: true
  })
  not?: NestedEnumnotification_sender_enumNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => NestedIntNullableFilter, {
    nullable: true
  })
  _count?: NestedIntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumnotification_sender_enumNullableFilter, {
    nullable: true
  })
  _min?: NestedEnumnotification_sender_enumNullableFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumnotification_sender_enumNullableFilter, {
    nullable: true
  })
  _max?: NestedEnumnotification_sender_enumNullableFilter | undefined;
}
