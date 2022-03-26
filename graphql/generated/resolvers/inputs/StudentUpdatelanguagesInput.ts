import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { student_languages_enum } from "../../enums/student_languages_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class StudentUpdatelanguagesInput {
  @TypeGraphQL.Field(_type => [student_languages_enum], {
    nullable: true
  })
  set?: Array<"Albanisch" | "Arabisch" | "Armenisch" | "Aserbaidschanisch" | "Bosnisch" | "Bulgarisch" | "Chinesisch" | "Deutsch" | "Englisch" | "Franz_sisch" | "Italienisch" | "Kasachisch" | "Kurdisch" | "Polnisch" | "Portugiesisch" | "Russisch" | "T_rkisch" | "Spanisch" | "Ukrainisch" | "Vietnamesisch" | "Andere"> | undefined;

  @TypeGraphQL.Field(_type => [student_languages_enum], {
    nullable: true
  })
  push?: Array<"Albanisch" | "Arabisch" | "Armenisch" | "Aserbaidschanisch" | "Bosnisch" | "Bulgarisch" | "Chinesisch" | "Deutsch" | "Englisch" | "Franz_sisch" | "Italienisch" | "Kasachisch" | "Kurdisch" | "Polnisch" | "Portugiesisch" | "Russisch" | "T_rkisch" | "Spanisch" | "Ukrainisch" | "Vietnamesisch" | "Andere"> | undefined;
}
