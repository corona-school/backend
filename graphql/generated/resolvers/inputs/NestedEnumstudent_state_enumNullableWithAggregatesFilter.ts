import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedEnumstudent_state_enumNullableFilter } from "../inputs/NestedEnumstudent_state_enumNullableFilter";
import { NestedIntNullableFilter } from "../inputs/NestedIntNullableFilter";
import { student_state_enum } from "../../enums/student_state_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class NestedEnumstudent_state_enumNullableWithAggregatesFilter {
  @TypeGraphQL.Field(_type => student_state_enum, {
    nullable: true
  })
  equals?: "bw" | "by" | "be" | "bb" | "hb" | "hh" | "he" | "mv" | "ni" | "nw" | "rp" | "sl" | "sn" | "st" | "sh" | "th" | "other" | undefined;

  @TypeGraphQL.Field(_type => [student_state_enum], {
    nullable: true
  })
  in?: Array<"bw" | "by" | "be" | "bb" | "hb" | "hh" | "he" | "mv" | "ni" | "nw" | "rp" | "sl" | "sn" | "st" | "sh" | "th" | "other"> | undefined;

  @TypeGraphQL.Field(_type => [student_state_enum], {
    nullable: true
  })
  notIn?: Array<"bw" | "by" | "be" | "bb" | "hb" | "hh" | "he" | "mv" | "ni" | "nw" | "rp" | "sl" | "sn" | "st" | "sh" | "th" | "other"> | undefined;

  @TypeGraphQL.Field(_type => NestedEnumstudent_state_enumNullableWithAggregatesFilter, {
    nullable: true
  })
  not?: NestedEnumstudent_state_enumNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => NestedIntNullableFilter, {
    nullable: true
  })
  _count?: NestedIntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumstudent_state_enumNullableFilter, {
    nullable: true
  })
  _min?: NestedEnumstudent_state_enumNullableFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumstudent_state_enumNullableFilter, {
    nullable: true
  })
  _max?: NestedEnumstudent_state_enumNullableFilter | undefined;
}
