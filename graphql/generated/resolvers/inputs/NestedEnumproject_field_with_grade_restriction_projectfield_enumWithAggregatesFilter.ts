import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedEnumproject_field_with_grade_restriction_projectfield_enumFilter } from "../inputs/NestedEnumproject_field_with_grade_restriction_projectfield_enumFilter";
import { NestedIntFilter } from "../inputs/NestedIntFilter";
import { project_field_with_grade_restriction_projectfield_enum } from "../../enums/project_field_with_grade_restriction_projectfield_enum";

@TypeGraphQL.InputType("NestedEnumproject_field_with_grade_restriction_projectfield_enumWithAggregatesFilter", {
  isAbstract: true
})
export class NestedEnumproject_field_with_grade_restriction_projectfield_enumWithAggregatesFilter {
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

  @TypeGraphQL.Field(_type => NestedEnumproject_field_with_grade_restriction_projectfield_enumWithAggregatesFilter, {
    nullable: true
  })
  not?: NestedEnumproject_field_with_grade_restriction_projectfield_enumWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => NestedIntFilter, {
    nullable: true
  })
  _count?: NestedIntFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumproject_field_with_grade_restriction_projectfield_enumFilter, {
    nullable: true
  })
  _min?: NestedEnumproject_field_with_grade_restriction_projectfield_enumFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumproject_field_with_grade_restriction_projectfield_enumFilter, {
    nullable: true
  })
  _max?: NestedEnumproject_field_with_grade_restriction_projectfield_enumFilter | undefined;
}
