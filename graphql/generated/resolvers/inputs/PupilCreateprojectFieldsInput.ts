import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { pupil_projectfields_enum } from "../../enums/pupil_projectfields_enum";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class PupilCreateprojectFieldsInput {
  @TypeGraphQL.Field(_type => [pupil_projectfields_enum], {
    nullable: false
  })
  set!: Array<"Arbeitswelt" | "Biologie" | "Chemie" | "Geo_und_Raumwissenschaften" | "Mathematik_Informatik" | "Physik" | "Technik">;
}
