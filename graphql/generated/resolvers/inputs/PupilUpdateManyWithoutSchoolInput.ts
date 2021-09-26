import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateManySchoolInputEnvelope } from "../inputs/PupilCreateManySchoolInputEnvelope";
import { PupilCreateOrConnectWithoutSchoolInput } from "../inputs/PupilCreateOrConnectWithoutSchoolInput";
import { PupilCreateWithoutSchoolInput } from "../inputs/PupilCreateWithoutSchoolInput";
import { PupilScalarWhereInput } from "../inputs/PupilScalarWhereInput";
import { PupilUpdateManyWithWhereWithoutSchoolInput } from "../inputs/PupilUpdateManyWithWhereWithoutSchoolInput";
import { PupilUpdateWithWhereUniqueWithoutSchoolInput } from "../inputs/PupilUpdateWithWhereUniqueWithoutSchoolInput";
import { PupilUpsertWithWhereUniqueWithoutSchoolInput } from "../inputs/PupilUpsertWithWhereUniqueWithoutSchoolInput";
import { PupilWhereUniqueInput } from "../inputs/PupilWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class PupilUpdateManyWithoutSchoolInput {
  @TypeGraphQL.Field(_type => [PupilCreateWithoutSchoolInput], {
    nullable: true
  })
  create?: PupilCreateWithoutSchoolInput[] | undefined;

  @TypeGraphQL.Field(_type => [PupilCreateOrConnectWithoutSchoolInput], {
    nullable: true
  })
  connectOrCreate?: PupilCreateOrConnectWithoutSchoolInput[] | undefined;

  @TypeGraphQL.Field(_type => [PupilUpsertWithWhereUniqueWithoutSchoolInput], {
    nullable: true
  })
  upsert?: PupilUpsertWithWhereUniqueWithoutSchoolInput[] | undefined;

  @TypeGraphQL.Field(_type => PupilCreateManySchoolInputEnvelope, {
    nullable: true
  })
  createMany?: PupilCreateManySchoolInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [PupilWhereUniqueInput], {
    nullable: true
  })
  connect?: PupilWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [PupilWhereUniqueInput], {
    nullable: true
  })
  set?: PupilWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [PupilWhereUniqueInput], {
    nullable: true
  })
  disconnect?: PupilWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [PupilWhereUniqueInput], {
    nullable: true
  })
  delete?: PupilWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [PupilUpdateWithWhereUniqueWithoutSchoolInput], {
    nullable: true
  })
  update?: PupilUpdateWithWhereUniqueWithoutSchoolInput[] | undefined;

  @TypeGraphQL.Field(_type => [PupilUpdateManyWithWhereWithoutSchoolInput], {
    nullable: true
  })
  updateMany?: PupilUpdateManyWithWhereWithoutSchoolInput[] | undefined;

  @TypeGraphQL.Field(_type => [PupilScalarWhereInput], {
    nullable: true
  })
  deleteMany?: PupilScalarWhereInput[] | undefined;
}
