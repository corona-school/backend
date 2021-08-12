import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedEnumschool_state_enumNullableFilter } from "../inputs/NestedEnumschool_state_enumNullableFilter";
import { NestedEnumschool_state_enumNullableWithAggregatesFilter } from "../inputs/NestedEnumschool_state_enumNullableWithAggregatesFilter";
import { NestedIntNullableFilter } from "../inputs/NestedIntNullableFilter";
import { school_state_enum } from "../../enums/school_state_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Enumschool_state_enumNullableWithAggregatesFilter {
  @TypeGraphQL.Field(_type => school_state_enum, {
    nullable: true
  })
  equals?: "bw" | "by" | "be" | "bb" | "hb" | "hh" | "he" | "mv" | "ni" | "nw" | "rp" | "sl" | "sn" | "st" | "sh" | "th" | "other" | undefined;

  @TypeGraphQL.Field(_type => [school_state_enum], {
    nullable: true
  })
  in?: Array<"bw" | "by" | "be" | "bb" | "hb" | "hh" | "he" | "mv" | "ni" | "nw" | "rp" | "sl" | "sn" | "st" | "sh" | "th" | "other"> | undefined;

  @TypeGraphQL.Field(_type => [school_state_enum], {
    nullable: true
  })
  notIn?: Array<"bw" | "by" | "be" | "bb" | "hb" | "hh" | "he" | "mv" | "ni" | "nw" | "rp" | "sl" | "sn" | "st" | "sh" | "th" | "other"> | undefined;

  @TypeGraphQL.Field(_type => NestedEnumschool_state_enumNullableWithAggregatesFilter, {
    nullable: true
  })
  not?: NestedEnumschool_state_enumNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => NestedIntNullableFilter, {
    nullable: true
  })
  _count?: NestedIntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumschool_state_enumNullableFilter, {
    nullable: true
  })
  _min?: NestedEnumschool_state_enumNullableFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumschool_state_enumNullableFilter, {
    nullable: true
  })
  _max?: NestedEnumschool_state_enumNullableFilter | undefined;
}
