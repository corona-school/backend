import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreenerCreateOrConnectWithoutCertificate_of_conductInput } from "../inputs/ScreenerCreateOrConnectWithoutCertificate_of_conductInput";
import { ScreenerCreateWithoutCertificate_of_conductInput } from "../inputs/ScreenerCreateWithoutCertificate_of_conductInput";
import { ScreenerUpdateWithoutCertificate_of_conductInput } from "../inputs/ScreenerUpdateWithoutCertificate_of_conductInput";
import { ScreenerUpsertWithoutCertificate_of_conductInput } from "../inputs/ScreenerUpsertWithoutCertificate_of_conductInput";
import { ScreenerWhereUniqueInput } from "../inputs/ScreenerWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class ScreenerUpdateOneWithoutCertificate_of_conductInput {
  @TypeGraphQL.Field(_type => ScreenerCreateWithoutCertificate_of_conductInput, {
    nullable: true
  })
  create?: ScreenerCreateWithoutCertificate_of_conductInput | undefined;

  @TypeGraphQL.Field(_type => ScreenerCreateOrConnectWithoutCertificate_of_conductInput, {
    nullable: true
  })
  connectOrCreate?: ScreenerCreateOrConnectWithoutCertificate_of_conductInput | undefined;

  @TypeGraphQL.Field(_type => ScreenerUpsertWithoutCertificate_of_conductInput, {
    nullable: true
  })
  upsert?: ScreenerUpsertWithoutCertificate_of_conductInput | undefined;

  @TypeGraphQL.Field(_type => ScreenerWhereUniqueInput, {
    nullable: true
  })
  connect?: ScreenerWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  disconnect?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  delete?: boolean | undefined;

  @TypeGraphQL.Field(_type => ScreenerUpdateWithoutCertificate_of_conductInput, {
    nullable: true
  })
  update?: ScreenerUpdateWithoutCertificate_of_conductInput | undefined;
}
