import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Project_coaching_screeningCreateManyScreenerInputEnvelope } from "../inputs/Project_coaching_screeningCreateManyScreenerInputEnvelope";
import { Project_coaching_screeningCreateOrConnectWithoutScreenerInput } from "../inputs/Project_coaching_screeningCreateOrConnectWithoutScreenerInput";
import { Project_coaching_screeningCreateWithoutScreenerInput } from "../inputs/Project_coaching_screeningCreateWithoutScreenerInput";
import { Project_coaching_screeningScalarWhereInput } from "../inputs/Project_coaching_screeningScalarWhereInput";
import { Project_coaching_screeningUpdateManyWithWhereWithoutScreenerInput } from "../inputs/Project_coaching_screeningUpdateManyWithWhereWithoutScreenerInput";
import { Project_coaching_screeningUpdateWithWhereUniqueWithoutScreenerInput } from "../inputs/Project_coaching_screeningUpdateWithWhereUniqueWithoutScreenerInput";
import { Project_coaching_screeningUpsertWithWhereUniqueWithoutScreenerInput } from "../inputs/Project_coaching_screeningUpsertWithWhereUniqueWithoutScreenerInput";
import { Project_coaching_screeningWhereUniqueInput } from "../inputs/Project_coaching_screeningWhereUniqueInput";

@TypeGraphQL.InputType("Project_coaching_screeningUpdateManyWithoutScreenerInput", {
  isAbstract: true
})
export class Project_coaching_screeningUpdateManyWithoutScreenerInput {
  @TypeGraphQL.Field(_type => [Project_coaching_screeningCreateWithoutScreenerInput], {
    nullable: true
  })
  create?: Project_coaching_screeningCreateWithoutScreenerInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_coaching_screeningCreateOrConnectWithoutScreenerInput], {
    nullable: true
  })
  connectOrCreate?: Project_coaching_screeningCreateOrConnectWithoutScreenerInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_coaching_screeningUpsertWithWhereUniqueWithoutScreenerInput], {
    nullable: true
  })
  upsert?: Project_coaching_screeningUpsertWithWhereUniqueWithoutScreenerInput[] | undefined;

  @TypeGraphQL.Field(_type => Project_coaching_screeningCreateManyScreenerInputEnvelope, {
    nullable: true
  })
  createMany?: Project_coaching_screeningCreateManyScreenerInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Project_coaching_screeningWhereUniqueInput], {
    nullable: true
  })
  set?: Project_coaching_screeningWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_coaching_screeningWhereUniqueInput], {
    nullable: true
  })
  disconnect?: Project_coaching_screeningWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_coaching_screeningWhereUniqueInput], {
    nullable: true
  })
  delete?: Project_coaching_screeningWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_coaching_screeningWhereUniqueInput], {
    nullable: true
  })
  connect?: Project_coaching_screeningWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_coaching_screeningUpdateWithWhereUniqueWithoutScreenerInput], {
    nullable: true
  })
  update?: Project_coaching_screeningUpdateWithWhereUniqueWithoutScreenerInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_coaching_screeningUpdateManyWithWhereWithoutScreenerInput], {
    nullable: true
  })
  updateMany?: Project_coaching_screeningUpdateManyWithWhereWithoutScreenerInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_coaching_screeningScalarWhereInput], {
    nullable: true
  })
  deleteMany?: Project_coaching_screeningScalarWhereInput[] | undefined;
}
