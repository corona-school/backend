import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Certificate_of_conductUpdateWithoutInspectingScreenerInput } from "../inputs/Certificate_of_conductUpdateWithoutInspectingScreenerInput";
import { Certificate_of_conductWhereUniqueInput } from "../inputs/Certificate_of_conductWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Certificate_of_conductUpdateWithWhereUniqueWithoutInspectingScreenerInput {
  @TypeGraphQL.Field(_type => Certificate_of_conductWhereUniqueInput, {
    nullable: false
  })
  where!: Certificate_of_conductWhereUniqueInput;

  @TypeGraphQL.Field(_type => Certificate_of_conductUpdateWithoutInspectingScreenerInput, {
    nullable: false
  })
  data!: Certificate_of_conductUpdateWithoutInspectingScreenerInput;
}
