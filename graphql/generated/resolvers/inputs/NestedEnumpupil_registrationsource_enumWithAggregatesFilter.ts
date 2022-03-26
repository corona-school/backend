import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedEnumpupil_registrationsource_enumFilter } from "../inputs/NestedEnumpupil_registrationsource_enumFilter";
import { NestedIntFilter } from "../inputs/NestedIntFilter";
import { pupil_registrationsource_enum } from "../../enums/pupil_registrationsource_enum";

@TypeGraphQL.InputType("NestedEnumpupil_registrationsource_enumWithAggregatesFilter", {
  isAbstract: true
})
export class NestedEnumpupil_registrationsource_enumWithAggregatesFilter {
  @TypeGraphQL.Field(_type => pupil_registrationsource_enum, {
    nullable: true
  })
  equals?: "normal" | "cooperation" | "drehtuer" | "other" | "codu" | undefined;

  @TypeGraphQL.Field(_type => [pupil_registrationsource_enum], {
    nullable: true
  })
  in?: Array<"normal" | "cooperation" | "drehtuer" | "other" | "codu"> | undefined;

  @TypeGraphQL.Field(_type => [pupil_registrationsource_enum], {
    nullable: true
  })
  notIn?: Array<"normal" | "cooperation" | "drehtuer" | "other" | "codu"> | undefined;

  @TypeGraphQL.Field(_type => NestedEnumpupil_registrationsource_enumWithAggregatesFilter, {
    nullable: true
  })
  not?: NestedEnumpupil_registrationsource_enumWithAggregatesFilter | undefined;

  @TypeGraphQL.Field(_type => NestedIntFilter, {
    nullable: true
  })
  _count?: NestedIntFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumpupil_registrationsource_enumFilter, {
    nullable: true
  })
  _min?: NestedEnumpupil_registrationsource_enumFilter | undefined;

  @TypeGraphQL.Field(_type => NestedEnumpupil_registrationsource_enumFilter, {
    nullable: true
  })
  _max?: NestedEnumpupil_registrationsource_enumFilter | undefined;
}
