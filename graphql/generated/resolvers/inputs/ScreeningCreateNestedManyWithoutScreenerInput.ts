import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreeningCreateManyScreenerInputEnvelope } from "../inputs/ScreeningCreateManyScreenerInputEnvelope";
import { ScreeningCreateOrConnectWithoutScreenerInput } from "../inputs/ScreeningCreateOrConnectWithoutScreenerInput";
import { ScreeningCreateWithoutScreenerInput } from "../inputs/ScreeningCreateWithoutScreenerInput";
import { ScreeningWhereUniqueInput } from "../inputs/ScreeningWhereUniqueInput";

@TypeGraphQL.InputType("ScreeningCreateNestedManyWithoutScreenerInput", {
  isAbstract: true
})
export class ScreeningCreateNestedManyWithoutScreenerInput {
  @TypeGraphQL.Field(_type => [ScreeningCreateWithoutScreenerInput], {
    nullable: true
  })
  create?: ScreeningCreateWithoutScreenerInput[] | undefined;

  @TypeGraphQL.Field(_type => [ScreeningCreateOrConnectWithoutScreenerInput], {
    nullable: true
  })
  connectOrCreate?: ScreeningCreateOrConnectWithoutScreenerInput[] | undefined;

  @TypeGraphQL.Field(_type => ScreeningCreateManyScreenerInputEnvelope, {
    nullable: true
  })
  createMany?: ScreeningCreateManyScreenerInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [ScreeningWhereUniqueInput], {
    nullable: true
  })
  connect?: ScreeningWhereUniqueInput[] | undefined;
}
