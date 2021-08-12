import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { NestedEnumpupil_registrationsource_enumFilter } from "../inputs/NestedEnumpupil_registrationsource_enumFilter";
import { pupil_registrationsource_enum } from "../../enums/pupil_registrationsource_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Enumpupil_registrationsource_enumFilter {
  @TypeGraphQL.Field(_type => pupil_registrationsource_enum, {
    nullable: true
  })
  equals?: "normal" | "cooperation" | "drehtuer" | "other" | undefined;

  @TypeGraphQL.Field(_type => [pupil_registrationsource_enum], {
    nullable: true
  })
  in?: Array<"normal" | "cooperation" | "drehtuer" | "other"> | undefined;

  @TypeGraphQL.Field(_type => [pupil_registrationsource_enum], {
    nullable: true
  })
  notIn?: Array<"normal" | "cooperation" | "drehtuer" | "other"> | undefined;

  @TypeGraphQL.Field(_type => NestedEnumpupil_registrationsource_enumFilter, {
    nullable: true
  })
  not?: NestedEnumpupil_registrationsource_enumFilter | undefined;
}
