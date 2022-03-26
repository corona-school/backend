import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreenerCreateOrConnectWithoutInstructor_screeningInput } from "../inputs/ScreenerCreateOrConnectWithoutInstructor_screeningInput";
import { ScreenerCreateWithoutInstructor_screeningInput } from "../inputs/ScreenerCreateWithoutInstructor_screeningInput";
import { ScreenerWhereUniqueInput } from "../inputs/ScreenerWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class ScreenerCreateNestedOneWithoutInstructor_screeningInput {
  @TypeGraphQL.Field(_type => ScreenerCreateWithoutInstructor_screeningInput, {
    nullable: true
  })
  create?: ScreenerCreateWithoutInstructor_screeningInput | undefined;

  @TypeGraphQL.Field(_type => ScreenerCreateOrConnectWithoutInstructor_screeningInput, {
    nullable: true
  })
  connectOrCreate?: ScreenerCreateOrConnectWithoutInstructor_screeningInput | undefined;

  @TypeGraphQL.Field(_type => ScreenerWhereUniqueInput, {
    nullable: true
  })
  connect?: ScreenerWhereUniqueInput | undefined;
}
