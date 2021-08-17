import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreenerCreateWithoutInstructor_screeningInput } from "../inputs/ScreenerCreateWithoutInstructor_screeningInput";
import { ScreenerUpdateWithoutInstructor_screeningInput } from "../inputs/ScreenerUpdateWithoutInstructor_screeningInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class ScreenerUpsertWithoutInstructor_screeningInput {
  @TypeGraphQL.Field(_type => ScreenerUpdateWithoutInstructor_screeningInput, {
    nullable: false
  })
  update!: ScreenerUpdateWithoutInstructor_screeningInput;

  @TypeGraphQL.Field(_type => ScreenerCreateWithoutInstructor_screeningInput, {
    nullable: false
  })
  create!: ScreenerCreateWithoutInstructor_screeningInput;
}
