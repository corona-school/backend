import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedEnumschool_schooltype_enumFilter } from "../inputs/NestedEnumschool_schooltype_enumFilter";
import { NestedIntFilter } from "../inputs/NestedIntFilter";
import { school_schooltype_enum } from "../../enums/school_schooltype_enum";

@TypeGraphQL.InputType("NestedEnumschool_schooltype_enumWithAggregatesFilter", {
  isAbstract: true
})
export class NestedEnumschool_schooltype_enumWithAggregatesFilter {
  @TypeGraphQL.Field(_type => school_schooltype_enum, {
    nullable: true
  })
  equals?: "grundschule" | "gesamtschule" | "hauptschule" | "realschule" | "gymnasium" | "f_rderschule" | "berufsschule" | "other" | undefined;

  @TypeGraphQL.Field(_type => [school_schooltype_enum], {
    nullable: true
  })
  in?: Array<"grundschule" | "gesamtschule" | "hauptschule" | "realschule" | "gymnasium" | "f_rderschule" | "berufsschule" | "other"> | undefined;

  @TypeGraphQL.Field(_type => [school_schooltype_enum], {
    nullable: true
  })
  notIn?: Array<"grundschule" | "gesamtschule" | "hauptschule" | "realschule" | "gymnasium" | "f_rderschule" | "berufsschule" | "other"> | undefined;

  @TypeGraphQL.Field(_type => NestedEnumschool_schooltype_enumWithAggregatesFilter, {
    nullable: true
  })
  not?: NestedEnumschool_schooltype_enumWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => NestedIntFilter, {
    nullable: true
  })
  _count?: NestedIntFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumschool_schooltype_enumFilter, {
    nullable: true
  })
  _min?: NestedEnumschool_schooltype_enumFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumschool_schooltype_enumFilter, {
    nullable: true
  })
  _max?: NestedEnumschool_schooltype_enumFilter | undefined;
}
