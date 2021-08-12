import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreenerCreateWithoutProject_coaching_screeningInput } from "../inputs/ScreenerCreateWithoutProject_coaching_screeningInput";
import { ScreenerUpdateWithoutProject_coaching_screeningInput } from "../inputs/ScreenerUpdateWithoutProject_coaching_screeningInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class ScreenerUpsertWithoutProject_coaching_screeningInput {
  @TypeGraphQL.Field(_type => ScreenerUpdateWithoutProject_coaching_screeningInput, {
    nullable: false
  })
  update!: ScreenerUpdateWithoutProject_coaching_screeningInput;

  @TypeGraphQL.Field(_type => ScreenerCreateWithoutProject_coaching_screeningInput, {
    nullable: false
  })
  create!: ScreenerCreateWithoutProject_coaching_screeningInput;
}
