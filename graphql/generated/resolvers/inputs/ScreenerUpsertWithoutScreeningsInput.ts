import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreenerCreateWithoutScreeningsInput } from "../inputs/ScreenerCreateWithoutScreeningsInput";
import { ScreenerUpdateWithoutScreeningsInput } from "../inputs/ScreenerUpdateWithoutScreeningsInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class ScreenerUpsertWithoutScreeningsInput {
  @TypeGraphQL.Field(_type => ScreenerUpdateWithoutScreeningsInput, {
    nullable: false
  })
  update!: ScreenerUpdateWithoutScreeningsInput;

  @TypeGraphQL.Field(_type => ScreenerCreateWithoutScreeningsInput, {
    nullable: false
  })
  create!: ScreenerCreateWithoutScreeningsInput;
}
