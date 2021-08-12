import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { student_module_enum } from "../../enums/student_module_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class NestedEnumstudent_module_enumNullableFilter {
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

  @TypeGraphQL.Field(_type => NestedEnumstudent_module_enumNullableFilter, {
    nullable: true
  })
  not?: NestedEnumstudent_module_enumNullableFilter | undefined;
}
