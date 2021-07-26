import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { language } from "../../enums/language";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class PupilCreateManylanguagesInput {
  @TypeGraphQL.Field(_type => [language], {
    nullable: false
  })
  set!: Array<"sq" | "ar" | "hy" | "az" | "bs" | "bg" | "zh" | "de" | "en" | "fr" | "it" | "kk" | "ku" | "pl" | "pt" | "ru" | "tr" | "es" | "uk" | "vi" | "other">;
}
