import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreenerCreateWithoutProject_coaching_screeningInput } from "../inputs/ScreenerCreateWithoutProject_coaching_screeningInput";
import { ScreenerWhereUniqueInput } from "../inputs/ScreenerWhereUniqueInput";

@TypeGraphQL.InputType("ScreenerCreateOrConnectWithoutProject_coaching_screeningInput", {
  isAbstract: true
})
export class ScreenerCreateOrConnectWithoutProject_coaching_screeningInput {
  @TypeGraphQL.Field(_type => ScreenerWhereUniqueInput, {
    nullable: false
  })
  where!: ScreenerWhereUniqueInput;

  @TypeGraphQL.Field(_type => ScreenerCreateWithoutProject_coaching_screeningInput, {
    nullable: false
  })
  create!: ScreenerCreateWithoutProject_coaching_screeningInput;
}
