import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { pupil_learninggermansince_enum } from "../../enums/pupil_learninggermansince_enum";

@TypeGraphQL.InputType("NullableEnumpupil_learninggermansince_enumFieldUpdateOperationsInput", {
  isAbstract: true
})
export class NullableEnumpupil_learninggermansince_enumFieldUpdateOperationsInput {
  @TypeGraphQL.Field(_type => pupil_learninggermansince_enum, {
    nullable: true
  })
  set?: "more_than_four" | "two_to_four" | "one_to_two" | "less_than_one" | undefined;
}
