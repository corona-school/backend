import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreeningCreateManyScreenerInputEnvelope } from "../inputs/ScreeningCreateManyScreenerInputEnvelope";
import { ScreeningCreateOrConnectWithoutScreenerInput } from "../inputs/ScreeningCreateOrConnectWithoutScreenerInput";
import { ScreeningCreateWithoutScreenerInput } from "../inputs/ScreeningCreateWithoutScreenerInput";
import { ScreeningScalarWhereInput } from "../inputs/ScreeningScalarWhereInput";
import { ScreeningUpdateManyWithWhereWithoutScreenerInput } from "../inputs/ScreeningUpdateManyWithWhereWithoutScreenerInput";
import { ScreeningUpdateWithWhereUniqueWithoutScreenerInput } from "../inputs/ScreeningUpdateWithWhereUniqueWithoutScreenerInput";
import { ScreeningUpsertWithWhereUniqueWithoutScreenerInput } from "../inputs/ScreeningUpsertWithWhereUniqueWithoutScreenerInput";
import { ScreeningWhereUniqueInput } from "../inputs/ScreeningWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class ScreeningUpdateManyWithoutScreenerInput {
  @TypeGraphQL.Field(_type => [ScreeningCreateWithoutScreenerInput], {
    nullable: true
  })
  create?: ScreeningCreateWithoutScreenerInput[] | undefined;

  @TypeGraphQL.Field(_type => [ScreeningCreateOrConnectWithoutScreenerInput], {
    nullable: true
  })
  connectOrCreate?: ScreeningCreateOrConnectWithoutScreenerInput[] | undefined;

  @TypeGraphQL.Field(_type => [ScreeningUpsertWithWhereUniqueWithoutScreenerInput], {
    nullable: true
  })
  upsert?: ScreeningUpsertWithWhereUniqueWithoutScreenerInput[] | undefined;

  @TypeGraphQL.Field(_type => ScreeningCreateManyScreenerInputEnvelope, {
    nullable: true
  })
  createMany?: ScreeningCreateManyScreenerInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [ScreeningWhereUniqueInput], {
    nullable: true
  })
  connect?: ScreeningWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [ScreeningWhereUniqueInput], {
    nullable: true
  })
  set?: ScreeningWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [ScreeningWhereUniqueInput], {
    nullable: true
  })
  disconnect?: ScreeningWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [ScreeningWhereUniqueInput], {
    nullable: true
  })
  delete?: ScreeningWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [ScreeningUpdateWithWhereUniqueWithoutScreenerInput], {
    nullable: true
  })
  update?: ScreeningUpdateWithWhereUniqueWithoutScreenerInput[] | undefined;

  @TypeGraphQL.Field(_type => [ScreeningUpdateManyWithWhereWithoutScreenerInput], {
    nullable: true
  })
  updateMany?: ScreeningUpdateManyWithWhereWithoutScreenerInput[] | undefined;

  @TypeGraphQL.Field(_type => [ScreeningScalarWhereInput], {
    nullable: true
  })
  deleteMany?: ScreeningScalarWhereInput[] | undefined;
}
