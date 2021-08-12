import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreenerCreateWithoutScreeningInput } from "../inputs/ScreenerCreateWithoutScreeningInput";
import { ScreenerWhereUniqueInput } from "../inputs/ScreenerWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class ScreenerCreateOrConnectWithoutScreeningInput {
  @TypeGraphQL.Field(_type => ScreenerWhereUniqueInput, {
    nullable: false
  })
  where!: ScreenerWhereUniqueInput;

  @TypeGraphQL.Field(_type => ScreenerCreateWithoutScreeningInput, {
    nullable: false
  })
  create!: ScreenerCreateWithoutScreeningInput;
}
