import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedEnumpupil_learninggermansince_enumNullableFilter } from "../inputs/NestedEnumpupil_learninggermansince_enumNullableFilter";
import { NestedIntNullableFilter } from "../inputs/NestedIntNullableFilter";
import { pupil_learninggermansince_enum } from "../../enums/pupil_learninggermansince_enum";

@TypeGraphQL.InputType("NestedEnumpupil_learninggermansince_enumNullableWithAggregatesFilter", {
  isAbstract: true
})
export class NestedEnumpupil_learninggermansince_enumNullableWithAggregatesFilter {
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

  @TypeGraphQL.Field(_type => NestedEnumpupil_learninggermansince_enumNullableWithAggregatesFilter, {
    nullable: true
  })
  not?: NestedEnumpupil_learninggermansince_enumNullableWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => NestedIntNullableFilter, {
    nullable: true
  })
  _count?: NestedIntNullableFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumpupil_learninggermansince_enumNullableFilter, {
    nullable: true
  })
  _min?: NestedEnumpupil_learninggermansince_enumNullableFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumpupil_learninggermansince_enumNullableFilter, {
    nullable: true
  })
  _max?: NestedEnumpupil_learninggermansince_enumNullableFilter | undefined;
}
