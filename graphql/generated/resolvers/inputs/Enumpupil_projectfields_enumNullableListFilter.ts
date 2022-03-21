import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { pupil_projectfields_enum } from "../../enums/pupil_projectfields_enum";

@TypeGraphQL.InputType("Enumpupil_projectfields_enumNullableListFilter", {
  isAbstract: true
})
export class Enumpupil_projectfields_enumNullableListFilter {
  @TypeGraphQL.Field(_type => [pupil_projectfields_enum], {
    nullable: true
  })
  equals?: Array<"Arbeitswelt" | "Biologie" | "Chemie" | "Geo_und_Raumwissenschaften" | "Mathematik_Informatik" | "Physik" | "Technik"> | undefined;

  @TypeGraphQL.Field(_type => pupil_projectfields_enum, {
    nullable: true
  })
  has?: "Arbeitswelt" | "Biologie" | "Chemie" | "Geo_und_Raumwissenschaften" | "Mathematik_Informatik" | "Physik" | "Technik" | undefined;

  @TypeGraphQL.Field(_type => [pupil_projectfields_enum], {
    nullable: true
  })
  hasEvery?: Array<"Arbeitswelt" | "Biologie" | "Chemie" | "Geo_und_Raumwissenschaften" | "Mathematik_Informatik" | "Physik" | "Technik"> | undefined;

  @TypeGraphQL.Field(_type => [pupil_projectfields_enum], {
    nullable: true
  })
  hasSome?: Array<"Arbeitswelt" | "Biologie" | "Chemie" | "Geo_und_Raumwissenschaften" | "Mathematik_Informatik" | "Physik" | "Technik"> | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  isEmpty?: boolean | undefined;
}
