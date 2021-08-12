import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreenerCreateWithoutScreeningInput } from "../inputs/ScreenerCreateWithoutScreeningInput";
import { ScreenerUpdateWithoutScreeningInput } from "../inputs/ScreenerUpdateWithoutScreeningInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class ScreenerUpsertWithoutScreeningInput {
  @TypeGraphQL.Field(_type => ScreenerUpdateWithoutScreeningInput, {
    nullable: false
  })
  update!: ScreenerUpdateWithoutScreeningInput;

  @TypeGraphQL.Field(_type => ScreenerCreateWithoutScreeningInput, {
    nullable: false
  })
  create!: ScreenerCreateWithoutScreeningInput;
}
