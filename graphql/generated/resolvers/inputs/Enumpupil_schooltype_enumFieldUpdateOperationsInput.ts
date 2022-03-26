import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { pupil_schooltype_enum } from "../../enums/pupil_schooltype_enum";

@TypeGraphQL.InputType("Enumpupil_schooltype_enumFieldUpdateOperationsInput", {
  isAbstract: true
})
export class Enumpupil_schooltype_enumFieldUpdateOperationsInput {
  @TypeGraphQL.Field(_type => pupil_schooltype_enum, {
    nullable: true
  })
  set?: "grundschule" | "gesamtschule" | "hauptschule" | "realschule" | "gymnasium" | "f_rderschule" | "berufsschule" | "other" | undefined;
}
