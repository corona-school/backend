import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreenerCreateWithoutCertificate_of_conductInput } from "../inputs/ScreenerCreateWithoutCertificate_of_conductInput";
import { ScreenerUpdateWithoutCertificate_of_conductInput } from "../inputs/ScreenerUpdateWithoutCertificate_of_conductInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class ScreenerUpsertWithoutCertificate_of_conductInput {
  @TypeGraphQL.Field(_type => ScreenerUpdateWithoutCertificate_of_conductInput, {
    nullable: false
  })
  update!: ScreenerUpdateWithoutCertificate_of_conductInput;

  @TypeGraphQL.Field(_type => ScreenerCreateWithoutCertificate_of_conductInput, {
    nullable: false
  })
  create!: ScreenerCreateWithoutCertificate_of_conductInput;
}
