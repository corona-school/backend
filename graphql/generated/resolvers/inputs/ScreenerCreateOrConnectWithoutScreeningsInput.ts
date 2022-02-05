import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreenerCreateWithoutScreeningsInput } from "../inputs/ScreenerCreateWithoutScreeningsInput";
import { ScreenerWhereUniqueInput } from "../inputs/ScreenerWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class ScreenerCreateOrConnectWithoutScreeningsInput {
  @TypeGraphQL.Field(_type => ScreenerWhereUniqueInput, {
    nullable: false
  })
  where!: ScreenerWhereUniqueInput;

  @TypeGraphQL.Field(_type => ScreenerCreateWithoutScreeningsInput, {
    nullable: false
  })
  create!: ScreenerCreateWithoutScreeningsInput;
}
