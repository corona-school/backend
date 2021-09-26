import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreenerCreateOrConnectWithoutCertificate_of_conductInput } from "../inputs/ScreenerCreateOrConnectWithoutCertificate_of_conductInput";
import { ScreenerCreateWithoutCertificate_of_conductInput } from "../inputs/ScreenerCreateWithoutCertificate_of_conductInput";
import { ScreenerWhereUniqueInput } from "../inputs/ScreenerWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class ScreenerCreateNestedOneWithoutCertificate_of_conductInput {
  @TypeGraphQL.Field(_type => ScreenerCreateWithoutCertificate_of_conductInput, {
    nullable: true
  })
  create?: ScreenerCreateWithoutCertificate_of_conductInput | undefined;

  @TypeGraphQL.Field(_type => ScreenerCreateOrConnectWithoutCertificate_of_conductInput, {
    nullable: true
  })
  connectOrCreate?: ScreenerCreateOrConnectWithoutCertificate_of_conductInput | undefined;

  @TypeGraphQL.Field(_type => ScreenerWhereUniqueInput, {
    nullable: true
  })
  connect?: ScreenerWhereUniqueInput | undefined;
}
