import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreenerCreateOrConnectWithoutScreeningInput } from "../inputs/ScreenerCreateOrConnectWithoutScreeningInput";
import { ScreenerCreateWithoutScreeningInput } from "../inputs/ScreenerCreateWithoutScreeningInput";
import { ScreenerWhereUniqueInput } from "../inputs/ScreenerWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class ScreenerCreateNestedOneWithoutScreeningInput {
  @TypeGraphQL.Field(_type => ScreenerCreateWithoutScreeningInput, {
    nullable: true
  })
  create?: ScreenerCreateWithoutScreeningInput | undefined;

  @TypeGraphQL.Field(_type => ScreenerCreateOrConnectWithoutScreeningInput, {
    nullable: true
  })
  connectOrCreate?: ScreenerCreateOrConnectWithoutScreeningInput | undefined;

  @TypeGraphQL.Field(_type => ScreenerWhereUniqueInput, {
    nullable: true
  })
  connect?: ScreenerWhereUniqueInput | undefined;
}
