import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedEnumpupil_learninggermansince_enumNullableFilter } from "../inputs/NestedEnumpupil_learninggermansince_enumNullableFilter";
import { pupil_learninggermansince_enum } from "../../enums/pupil_learninggermansince_enum";

@TypeGraphQL.InputType("Enumpupil_learninggermansince_enumNullableFilter", {
  isAbstract: true
})
export class Enumpupil_learninggermansince_enumNullableFilter {
  @TypeGraphQL.Field(_type => pupil_learninggermansince_enum, {
    nullable: true
  })
  equals?: "more_than_four" | "two_to_four" | "one_to_two" | "less_than_one" | undefined;

  @TypeGraphQL.Field(_type => [pupil_learninggermansince_enum], {
    nullable: true
  })
  in?: Array<"more_than_four" | "two_to_four" | "one_to_two" | "less_than_one"> | undefined;

  @TypeGraphQL.Field(_type => [pupil_learninggermansince_enum], {
    nullable: true
  })
  notIn?: Array<"more_than_four" | "two_to_four" | "one_to_two" | "less_than_one"> | undefined;

  @TypeGraphQL.Field(_type => NestedEnumpupil_learninggermansince_enumNullableFilter, {
    nullable: true
  })
  not?: NestedEnumpupil_learninggermansince_enumNullableFilter | undefined;
}
