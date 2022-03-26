import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { school_schooltype_enum } from "../../enums/school_schooltype_enum";

@TypeGraphQL.InputType("Enumschool_schooltype_enumFieldUpdateOperationsInput", {
  isAbstract: true
})
export class Enumschool_schooltype_enumFieldUpdateOperationsInput {
  @TypeGraphQL.Field(_type => school_schooltype_enum, {
    nullable: true
  })
  set?: "grundschule" | "gesamtschule" | "hauptschule" | "realschule" | "gymnasium" | "f_rderschule" | "berufsschule" | "other" | undefined;
}
