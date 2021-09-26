import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { pupil_schooltype_enum } from "../../enums/pupil_schooltype_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class NestedEnumpupil_schooltype_enumFilter {
  @TypeGraphQL.Field(_type => pupil_schooltype_enum, {
    nullable: true
  })
  equals?: "grundschule" | "gesamtschule" | "hauptschule" | "realschule" | "gymnasium" | "f_rderschule" | "berufsschule" | "other" | undefined;

  @TypeGraphQL.Field(_type => [pupil_schooltype_enum], {
    nullable: true
  })
  in?: Array<"grundschule" | "gesamtschule" | "hauptschule" | "realschule" | "gymnasium" | "f_rderschule" | "berufsschule" | "other"> | undefined;

  @TypeGraphQL.Field(_type => [pupil_schooltype_enum], {
    nullable: true
  })
  notIn?: Array<"grundschule" | "gesamtschule" | "hauptschule" | "realschule" | "gymnasium" | "f_rderschule" | "berufsschule" | "other"> | undefined;

  @TypeGraphQL.Field(_type => NestedEnumpupil_schooltype_enumFilter, {
    nullable: true
  })
  not?: NestedEnumpupil_schooltype_enumFilter | undefined;
}
