import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Instructor_screeningCreateManyScreenerInputEnvelope } from "../inputs/Instructor_screeningCreateManyScreenerInputEnvelope";
import { Instructor_screeningCreateOrConnectWithoutScreenerInput } from "../inputs/Instructor_screeningCreateOrConnectWithoutScreenerInput";
import { Instructor_screeningCreateWithoutScreenerInput } from "../inputs/Instructor_screeningCreateWithoutScreenerInput";
import { Instructor_screeningScalarWhereInput } from "../inputs/Instructor_screeningScalarWhereInput";
import { Instructor_screeningUpdateManyWithWhereWithoutScreenerInput } from "../inputs/Instructor_screeningUpdateManyWithWhereWithoutScreenerInput";
import { Instructor_screeningUpdateWithWhereUniqueWithoutScreenerInput } from "../inputs/Instructor_screeningUpdateWithWhereUniqueWithoutScreenerInput";
import { Instructor_screeningUpsertWithWhereUniqueWithoutScreenerInput } from "../inputs/Instructor_screeningUpsertWithWhereUniqueWithoutScreenerInput";
import { Instructor_screeningWhereUniqueInput } from "../inputs/Instructor_screeningWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Instructor_screeningUpdateManyWithoutScreenerInput {
  @TypeGraphQL.Field(_type => [Instructor_screeningCreateWithoutScreenerInput], {
    nullable: true
  })
  create?: Instructor_screeningCreateWithoutScreenerInput[] | undefined;

  @TypeGraphQL.Field(_type => [Instructor_screeningCreateOrConnectWithoutScreenerInput], {
    nullable: true
  })
  connectOrCreate?: Instructor_screeningCreateOrConnectWithoutScreenerInput[] | undefined;

  @TypeGraphQL.Field(_type => [Instructor_screeningUpsertWithWhereUniqueWithoutScreenerInput], {
    nullable: true
  })
  upsert?: Instructor_screeningUpsertWithWhereUniqueWithoutScreenerInput[] | undefined;

  @TypeGraphQL.Field(_type => Instructor_screeningCreateManyScreenerInputEnvelope, {
    nullable: true
  })
  createMany?: Instructor_screeningCreateManyScreenerInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Instructor_screeningWhereUniqueInput], {
    nullable: true
  })
  connect?: Instructor_screeningWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Instructor_screeningWhereUniqueInput], {
    nullable: true
  })
  set?: Instructor_screeningWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Instructor_screeningWhereUniqueInput], {
    nullable: true
  })
  disconnect?: Instructor_screeningWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Instructor_screeningWhereUniqueInput], {
    nullable: true
  })
  delete?: Instructor_screeningWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Instructor_screeningUpdateWithWhereUniqueWithoutScreenerInput], {
    nullable: true
  })
  update?: Instructor_screeningUpdateWithWhereUniqueWithoutScreenerInput[] | undefined;

  @TypeGraphQL.Field(_type => [Instructor_screeningUpdateManyWithWhereWithoutScreenerInput], {
    nullable: true
  })
  updateMany?: Instructor_screeningUpdateManyWithWhereWithoutScreenerInput[] | undefined;

  @TypeGraphQL.Field(_type => [Instructor_screeningScalarWhereInput], {
    nullable: true
  })
  deleteMany?: Instructor_screeningScalarWhereInput[] | undefined;
}
