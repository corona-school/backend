import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreenerCreateOrConnectWithoutInstructor_screeningInput } from "../inputs/ScreenerCreateOrConnectWithoutInstructor_screeningInput";
import { ScreenerCreateWithoutInstructor_screeningInput } from "../inputs/ScreenerCreateWithoutInstructor_screeningInput";
import { ScreenerUpdateWithoutInstructor_screeningInput } from "../inputs/ScreenerUpdateWithoutInstructor_screeningInput";
import { ScreenerUpsertWithoutInstructor_screeningInput } from "../inputs/ScreenerUpsertWithoutInstructor_screeningInput";
import { ScreenerWhereUniqueInput } from "../inputs/ScreenerWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class ScreenerUpdateOneWithoutInstructor_screeningInput {
  @TypeGraphQL.Field(_type => ScreenerCreateWithoutInstructor_screeningInput, {
    nullable: true
  })
  create?: ScreenerCreateWithoutInstructor_screeningInput | undefined;

  @TypeGraphQL.Field(_type => ScreenerCreateOrConnectWithoutInstructor_screeningInput, {
    nullable: true
  })
  connectOrCreate?: ScreenerCreateOrConnectWithoutInstructor_screeningInput | undefined;

  @TypeGraphQL.Field(_type => ScreenerUpsertWithoutInstructor_screeningInput, {
    nullable: true
  })
  upsert?: ScreenerUpsertWithoutInstructor_screeningInput | undefined;

  @TypeGraphQL.Field(_type => ScreenerWhereUniqueInput, {
    nullable: true
  })
  connect?: ScreenerWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  disconnect?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  delete?: boolean | undefined;

  @TypeGraphQL.Field(_type => ScreenerUpdateWithoutInstructor_screeningInput, {
    nullable: true
  })
  update?: ScreenerUpdateWithoutInstructor_screeningInput | undefined;
}
