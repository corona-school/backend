import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedEnumpupil_state_enumFilter } from "../inputs/NestedEnumpupil_state_enumFilter";
import { pupil_state_enum } from "../../enums/pupil_state_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Enumpupil_state_enumFilter {
  @TypeGraphQL.Field(_type => pupil_state_enum, {
    nullable: true
  })
  equals?: "bw" | "by" | "be" | "bb" | "hb" | "hh" | "he" | "mv" | "ni" | "nw" | "rp" | "sl" | "sn" | "st" | "sh" | "th" | "other" | undefined;

  @TypeGraphQL.Field(_type => [pupil_state_enum], {
    nullable: true
  })
  in?: Array<"bw" | "by" | "be" | "bb" | "hb" | "hh" | "he" | "mv" | "ni" | "nw" | "rp" | "sl" | "sn" | "st" | "sh" | "th" | "other"> | undefined;

  @TypeGraphQL.Field(_type => [pupil_state_enum], {
    nullable: true
  })
  notIn?: Array<"bw" | "by" | "be" | "bb" | "hb" | "hh" | "he" | "mv" | "ni" | "nw" | "rp" | "sl" | "sn" | "st" | "sh" | "th" | "other"> | undefined;

  @TypeGraphQL.Field(_type => NestedEnumpupil_state_enumFilter, {
    nullable: true
  })
  not?: NestedEnumpupil_state_enumFilter | undefined;
}
