import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { student_state_enum } from "../../enums/student_state_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class NullableEnumstudent_state_enumFieldUpdateOperationsInput {
  @TypeGraphQL.Field(_type => student_state_enum, {
    nullable: true
  })
  set?: "bw" | "by" | "be" | "bb" | "hb" | "hh" | "he" | "mv" | "ni" | "nw" | "rp" | "sl" | "sn" | "st" | "sh" | "th" | "other" | undefined;
}
