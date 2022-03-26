import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedEnumschool_schooltype_enumFilter } from "../inputs/NestedEnumschool_schooltype_enumFilter";
import { school_schooltype_enum } from "../../enums/school_schooltype_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Enumschool_schooltype_enumFilter {
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

  @TypeGraphQL.Field(_type => NestedEnumschool_schooltype_enumFilter, {
    nullable: true
  })
  not?: NestedEnumschool_schooltype_enumFilter | undefined;
}
