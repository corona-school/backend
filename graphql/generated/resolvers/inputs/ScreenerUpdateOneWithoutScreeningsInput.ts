import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreenerCreateOrConnectWithoutScreeningsInput } from "../inputs/ScreenerCreateOrConnectWithoutScreeningsInput";
import { ScreenerCreateWithoutScreeningsInput } from "../inputs/ScreenerCreateWithoutScreeningsInput";
import { ScreenerUpdateWithoutScreeningsInput } from "../inputs/ScreenerUpdateWithoutScreeningsInput";
import { ScreenerUpsertWithoutScreeningsInput } from "../inputs/ScreenerUpsertWithoutScreeningsInput";
import { ScreenerWhereUniqueInput } from "../inputs/ScreenerWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class ScreenerUpdateOneWithoutScreeningsInput {
  @TypeGraphQL.Field(_type => ScreenerCreateWithoutScreeningsInput, {
    nullable: true
  })
  create?: ScreenerCreateWithoutScreeningsInput | undefined;

  @TypeGraphQL.Field(_type => ScreenerCreateOrConnectWithoutScreeningsInput, {
    nullable: true
  })
  connectOrCreate?: ScreenerCreateOrConnectWithoutScreeningsInput | undefined;

  @TypeGraphQL.Field(_type => ScreenerUpsertWithoutScreeningsInput, {
    nullable: true
  })
  upsert?: ScreenerUpsertWithoutScreeningsInput | undefined;

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

  @TypeGraphQL.Field(_type => ScreenerUpdateWithoutScreeningsInput, {
    nullable: true
  })
  update?: ScreenerUpdateWithoutScreeningsInput | undefined;
}
