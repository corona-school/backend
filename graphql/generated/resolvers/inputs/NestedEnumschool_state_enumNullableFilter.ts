import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { school_state_enum } from "../../enums/school_state_enum";

@TypeGraphQL.InputType("NestedEnumschool_state_enumNullableFilter", {
  isAbstract: true
})
export class NestedEnumschool_state_enumNullableFilter {
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

  @TypeGraphQL.Field(_type => NestedEnumschool_state_enumNullableFilter, {
    nullable: true
  })
  not?: NestedEnumschool_state_enumNullableFilter | undefined;
}
