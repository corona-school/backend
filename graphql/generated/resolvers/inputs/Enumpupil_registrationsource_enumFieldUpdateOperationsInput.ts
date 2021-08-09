import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { pupil_registrationsource_enum } from "../../enums/pupil_registrationsource_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Enumpupil_registrationsource_enumFieldUpdateOperationsInput {
  @TypeGraphQL.Field(_type => pupil_registrationsource_enum, {
    nullable: true
  })
  set?: "normal" | "cooperation" | "drehtuer" | "other" | undefined;
}
