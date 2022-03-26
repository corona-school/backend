import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { project_field_with_grade_restriction_projectfield_enum } from "../../enums/project_field_with_grade_restriction_projectfield_enum";

@TypeGraphQL.InputType("NestedEnumproject_field_with_grade_restriction_projectfield_enumFilter", {
  isAbstract: true
})
export class NestedEnumproject_field_with_grade_restriction_projectfield_enumFilter {
  @TypeGraphQL.Field(_type => project_field_with_grade_restriction_projectfield_enum, {
    nullable: true
  })
  equals?: "Arbeitswelt" | "Biologie" | "Chemie" | "Geo_und_Raumwissenschaften" | "Mathematik_Informatik" | "Physik" | "Technik" | undefined;

  @TypeGraphQL.Field(_type => [project_field_with_grade_restriction_projectfield_enum], {
    nullable: true
  })
  in?: Array<"Arbeitswelt" | "Biologie" | "Chemie" | "Geo_und_Raumwissenschaften" | "Mathematik_Informatik" | "Physik" | "Technik"> | undefined;

  @TypeGraphQL.Field(_type => [project_field_with_grade_restriction_projectfield_enum], {
    nullable: true
  })
  notIn?: Array<"Arbeitswelt" | "Biologie" | "Chemie" | "Geo_und_Raumwissenschaften" | "Mathematik_Informatik" | "Physik" | "Technik"> | undefined;

  @TypeGraphQL.Field(_type => NestedEnumproject_field_with_grade_restriction_projectfield_enumFilter, {
    nullable: true
  })
  not?: NestedEnumproject_field_with_grade_restriction_projectfield_enumFilter | undefined;
}
