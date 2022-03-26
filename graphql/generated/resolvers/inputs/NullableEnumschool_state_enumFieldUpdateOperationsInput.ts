import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { school_state_enum } from "../../enums/school_state_enum";

@TypeGraphQL.InputType("NullableEnumschool_state_enumFieldUpdateOperationsInput", {
  isAbstract: true
})
export class NullableEnumschool_state_enumFieldUpdateOperationsInput {
  @TypeGraphQL.Field(_type => school_state_enum, {
    nullable: true
  })
  set?: "bw" | "by" | "be" | "bb" | "hb" | "hh" | "he" | "mv" | "ni" | "nw" | "rp" | "sl" | "sn" | "st" | "sh" | "th" | "other" | undefined;
}
