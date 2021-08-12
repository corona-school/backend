import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreenerCreateOrConnectWithoutScreeningInput } from "../inputs/ScreenerCreateOrConnectWithoutScreeningInput";
import { ScreenerCreateWithoutScreeningInput } from "../inputs/ScreenerCreateWithoutScreeningInput";
import { ScreenerUpdateWithoutScreeningInput } from "../inputs/ScreenerUpdateWithoutScreeningInput";
import { ScreenerUpsertWithoutScreeningInput } from "../inputs/ScreenerUpsertWithoutScreeningInput";
import { ScreenerWhereUniqueInput } from "../inputs/ScreenerWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class ScreenerUpdateOneWithoutScreeningInput {
  @TypeGraphQL.Field(_type => ScreenerCreateWithoutScreeningInput, {
    nullable: true
  })
  create?: ScreenerCreateWithoutScreeningInput | undefined;

  @TypeGraphQL.Field(_type => ScreenerCreateOrConnectWithoutScreeningInput, {
    nullable: true
  })
  connectOrCreate?: ScreenerCreateOrConnectWithoutScreeningInput | undefined;

  @TypeGraphQL.Field(_type => ScreenerUpsertWithoutScreeningInput, {
    nullable: true
  })
  upsert?: ScreenerUpsertWithoutScreeningInput | undefined;

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

  @TypeGraphQL.Field(_type => ScreenerUpdateWithoutScreeningInput, {
    nullable: true
  })
  update?: ScreenerUpdateWithoutScreeningInput | undefined;
}
