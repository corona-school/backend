import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreeningUpdateWithoutScreenerInput } from "../inputs/ScreeningUpdateWithoutScreenerInput";
import { ScreeningWhereUniqueInput } from "../inputs/ScreeningWhereUniqueInput";

@TypeGraphQL.InputType("ScreeningUpdateWithWhereUniqueWithoutScreenerInput", {
  isAbstract: true
})
export class ScreeningUpdateWithWhereUniqueWithoutScreenerInput {
  @TypeGraphQL.Field(_type => ScreeningWhereUniqueInput, {
    nullable: false
  })
  where!: ScreeningWhereUniqueInput;

  @TypeGraphQL.Field(_type => ScreeningUpdateWithoutScreenerInput, {
    nullable: false
  })
  data!: ScreeningUpdateWithoutScreenerInput;
}
