import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreeningCreateWithoutScreenerInput } from "../inputs/ScreeningCreateWithoutScreenerInput";
import { ScreeningWhereUniqueInput } from "../inputs/ScreeningWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class ScreeningCreateOrConnectWithoutScreenerInput {
  @TypeGraphQL.Field(_type => ScreeningWhereUniqueInput, {
    nullable: false
  })
  where!: ScreeningWhereUniqueInput;

  @TypeGraphQL.Field(_type => ScreeningCreateWithoutScreenerInput, {
    nullable: false
  })
  create!: ScreeningCreateWithoutScreenerInput;
}
