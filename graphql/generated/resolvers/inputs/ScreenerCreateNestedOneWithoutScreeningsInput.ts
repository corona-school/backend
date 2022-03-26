import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreenerCreateOrConnectWithoutScreeningsInput } from "../inputs/ScreenerCreateOrConnectWithoutScreeningsInput";
import { ScreenerCreateWithoutScreeningsInput } from "../inputs/ScreenerCreateWithoutScreeningsInput";
import { ScreenerWhereUniqueInput } from "../inputs/ScreenerWhereUniqueInput";

@TypeGraphQL.InputType("ScreenerCreateNestedOneWithoutScreeningsInput", {
  isAbstract: true
})
export class ScreenerCreateNestedOneWithoutScreeningsInput {
  @TypeGraphQL.Field(_type => ScreenerCreateWithoutScreeningsInput, {
    nullable: true
  })
  create?: ScreenerCreateWithoutScreeningsInput | undefined;

  @TypeGraphQL.Field(_type => ScreenerCreateOrConnectWithoutScreeningsInput, {
    nullable: true
  })
  connectOrCreate?: ScreenerCreateOrConnectWithoutScreeningsInput | undefined;

  @TypeGraphQL.Field(_type => ScreenerWhereUniqueInput, {
    nullable: true
  })
  connect?: ScreenerWhereUniqueInput | undefined;
}
