import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { pupil_state_enum } from "../../enums/pupil_state_enum";

@TypeGraphQL.InputType("Enumpupil_state_enumFieldUpdateOperationsInput", {
  isAbstract: true
})
export class Enumpupil_state_enumFieldUpdateOperationsInput {
  @TypeGraphQL.Field(_type => pupil_state_enum, {
    nullable: true
  })
  set?: "bw" | "by" | "be" | "bb" | "hb" | "hh" | "he" | "mv" | "ni" | "nw" | "rp" | "sl" | "sn" | "st" | "sh" | "th" | "other" | undefined;
}
