import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreenerCreateOrConnectWithoutProject_coaching_screeningInput } from "../inputs/ScreenerCreateOrConnectWithoutProject_coaching_screeningInput";
import { ScreenerCreateWithoutProject_coaching_screeningInput } from "../inputs/ScreenerCreateWithoutProject_coaching_screeningInput";
import { ScreenerUpdateWithoutProject_coaching_screeningInput } from "../inputs/ScreenerUpdateWithoutProject_coaching_screeningInput";
import { ScreenerUpsertWithoutProject_coaching_screeningInput } from "../inputs/ScreenerUpsertWithoutProject_coaching_screeningInput";
import { ScreenerWhereUniqueInput } from "../inputs/ScreenerWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class ScreenerUpdateOneWithoutProject_coaching_screeningInput {
  @TypeGraphQL.Field(_type => ScreenerCreateWithoutProject_coaching_screeningInput, {
    nullable: true
  })
  create?: ScreenerCreateWithoutProject_coaching_screeningInput | undefined;

  @TypeGraphQL.Field(_type => ScreenerCreateOrConnectWithoutProject_coaching_screeningInput, {
    nullable: true
  })
  connectOrCreate?: ScreenerCreateOrConnectWithoutProject_coaching_screeningInput | undefined;

  @TypeGraphQL.Field(_type => ScreenerUpsertWithoutProject_coaching_screeningInput, {
    nullable: true
  })
  upsert?: ScreenerUpsertWithoutProject_coaching_screeningInput | undefined;

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

  @TypeGraphQL.Field(_type => ScreenerUpdateWithoutProject_coaching_screeningInput, {
    nullable: true
  })
  update?: ScreenerUpdateWithoutProject_coaching_screeningInput | undefined;
}
