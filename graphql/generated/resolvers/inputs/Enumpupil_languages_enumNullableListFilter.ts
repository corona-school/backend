import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { pupil_languages_enum } from "../../enums/pupil_languages_enum";

@TypeGraphQL.InputType("Enumpupil_languages_enumNullableListFilter", {
  isAbstract: true
})
export class Enumpupil_languages_enumNullableListFilter {
  @TypeGraphQL.Field(_type => [pupil_languages_enum], {
    nullable: true
  })
  equals?: Array<"Albanisch" | "Arabisch" | "Armenisch" | "Aserbaidschanisch" | "Bosnisch" | "Bulgarisch" | "Chinesisch" | "Deutsch" | "Englisch" | "Franz_sisch" | "Italienisch" | "Kasachisch" | "Kurdisch" | "Polnisch" | "Portugiesisch" | "Russisch" | "T_rkisch" | "Spanisch" | "Ukrainisch" | "Vietnamesisch" | "Andere"> | undefined;

  @TypeGraphQL.Field(_type => pupil_languages_enum, {
    nullable: true
  })
  has?: "Albanisch" | "Arabisch" | "Armenisch" | "Aserbaidschanisch" | "Bosnisch" | "Bulgarisch" | "Chinesisch" | "Deutsch" | "Englisch" | "Franz_sisch" | "Italienisch" | "Kasachisch" | "Kurdisch" | "Polnisch" | "Portugiesisch" | "Russisch" | "T_rkisch" | "Spanisch" | "Ukrainisch" | "Vietnamesisch" | "Andere" | undefined;

  @TypeGraphQL.Field(_type => [pupil_languages_enum], {
    nullable: true
  })
  hasEvery?: Array<"Albanisch" | "Arabisch" | "Armenisch" | "Aserbaidschanisch" | "Bosnisch" | "Bulgarisch" | "Chinesisch" | "Deutsch" | "Englisch" | "Franz_sisch" | "Italienisch" | "Kasachisch" | "Kurdisch" | "Polnisch" | "Portugiesisch" | "Russisch" | "T_rkisch" | "Spanisch" | "Ukrainisch" | "Vietnamesisch" | "Andere"> | undefined;

  @TypeGraphQL.Field(_type => [pupil_languages_enum], {
    nullable: true
  })
  hasSome?: Array<"Albanisch" | "Arabisch" | "Armenisch" | "Aserbaidschanisch" | "Bosnisch" | "Bulgarisch" | "Chinesisch" | "Deutsch" | "Englisch" | "Franz_sisch" | "Italienisch" | "Kasachisch" | "Kurdisch" | "Polnisch" | "Portugiesisch" | "Russisch" | "T_rkisch" | "Spanisch" | "Ukrainisch" | "Vietnamesisch" | "Andere"> | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  isEmpty?: boolean | undefined;
}
