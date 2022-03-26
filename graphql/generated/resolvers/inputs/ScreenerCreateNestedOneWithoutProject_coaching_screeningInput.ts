import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreenerCreateOrConnectWithoutProject_coaching_screeningInput } from "../inputs/ScreenerCreateOrConnectWithoutProject_coaching_screeningInput";
import { ScreenerCreateWithoutProject_coaching_screeningInput } from "../inputs/ScreenerCreateWithoutProject_coaching_screeningInput";
import { ScreenerWhereUniqueInput } from "../inputs/ScreenerWhereUniqueInput";

@TypeGraphQL.InputType("ScreenerCreateNestedOneWithoutProject_coaching_screeningInput", {
  isAbstract: true
})
export class ScreenerCreateNestedOneWithoutProject_coaching_screeningInput {
  @TypeGraphQL.Field(_type => ScreenerCreateWithoutProject_coaching_screeningInput, {
    nullable: true
  })
  create?: ScreenerCreateWithoutProject_coaching_screeningInput | undefined;

  @TypeGraphQL.Field(_type => ScreenerCreateOrConnectWithoutProject_coaching_screeningInput, {
    nullable: true
  })
  connectOrCreate?: ScreenerCreateOrConnectWithoutProject_coaching_screeningInput | undefined;

  @TypeGraphQL.Field(_type => ScreenerWhereUniqueInput, {
    nullable: true
  })
  connect?: ScreenerWhereUniqueInput | undefined;
}
