import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedEnumstudent_module_enumNullableFilter } from "../inputs/NestedEnumstudent_module_enumNullableFilter";
import { NestedIntNullableFilter } from "../inputs/NestedIntNullableFilter";
import { student_module_enum } from "../../enums/student_module_enum";

@TypeGraphQL.InputType("NestedEnumstudent_module_enumNullableWithAggregatesFilter", {
  isAbstract: true
})
export class NestedEnumstudent_module_enumNullableWithAggregatesFilter {
  @TypeGraphQL.Field(_type => student_module_enum, {
    nullable: true
  })
  equals?: "internship" | "seminar" | "other" | undefined;

  @TypeGraphQL.Field(_type => [student_module_enum], {
    nullable: true
  })
  in?: Array<"internship" | "seminar" | "other"> | undefined;

  @TypeGraphQL.Field(_type => [student_module_enum], {
    nullable: true
  })
  notIn?: Array<"internship" | "seminar" | "other"> | undefined;

  @TypeGraphQL.Field(_type => NestedEnumstudent_module_enumNullableWithAggregatesFilter, {
    nullable: true
  })
  not?: NestedEnumstudent_module_enumNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => NestedIntNullableFilter, {
    nullable: true
  })
  _count?: NestedIntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumstudent_module_enumNullableFilter, {
    nullable: true
  })
  _min?: NestedEnumstudent_module_enumNullableFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumstudent_module_enumNullableFilter, {
    nullable: true
  })
  _max?: NestedEnumstudent_module_enumNullableFilter | undefined;
}
