import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedEnumpupil_state_enumFilter } from "../inputs/NestedEnumpupil_state_enumFilter";
import { NestedIntFilter } from "../inputs/NestedIntFilter";
import { pupil_state_enum } from "../../enums/pupil_state_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class NestedEnumpupil_state_enumWithAggregatesFilter {
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

  @TypeGraphQL.Field(_type => NestedEnumpupil_state_enumWithAggregatesFilter, {
    nullable: true
  })
  not?: NestedEnumpupil_state_enumWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => NestedIntFilter, {
    nullable: true
  })
  _count?: NestedIntFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumpupil_state_enumFilter, {
    nullable: true
  })
  _min?: NestedEnumpupil_state_enumFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumpupil_state_enumFilter, {
    nullable: true
  })
  _max?: NestedEnumpupil_state_enumFilter | undefined;
}
