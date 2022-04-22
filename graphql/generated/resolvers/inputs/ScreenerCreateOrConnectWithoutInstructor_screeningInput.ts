import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreenerCreateWithoutInstructor_screeningInput } from "../inputs/ScreenerCreateWithoutInstructor_screeningInput";
import { ScreenerWhereUniqueInput } from "../inputs/ScreenerWhereUniqueInput";

@TypeGraphQL.InputType("ScreenerCreateOrConnectWithoutInstructor_screeningInput", {
  isAbstract: true
})
export class ScreenerCreateOrConnectWithoutInstructor_screeningInput {
  @TypeGraphQL.Field(_type => ScreenerWhereUniqueInput, {
    nullable: false
  })
  where!: ScreenerWhereUniqueInput;

  @TypeGraphQL.Field(_type => ScreenerCreateWithoutInstructor_screeningInput, {
    nullable: false
  })
  create!: ScreenerCreateWithoutInstructor_screeningInput;
}
