import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreenerCreateWithoutCertificate_of_conductInput } from "../inputs/ScreenerCreateWithoutCertificate_of_conductInput";
import { ScreenerWhereUniqueInput } from "../inputs/ScreenerWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class ScreenerCreateOrConnectWithoutCertificate_of_conductInput {
  @TypeGraphQL.Field(_type => ScreenerWhereUniqueInput, {
    nullable: false
  })
  where!: ScreenerWhereUniqueInput;

  @TypeGraphQL.Field(_type => ScreenerCreateWithoutCertificate_of_conductInput, {
    nullable: false
  })
  create!: ScreenerCreateWithoutCertificate_of_conductInput;
}
