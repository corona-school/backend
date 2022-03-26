import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Participation_certificateCreateManyPupilInputEnvelope } from "../inputs/Participation_certificateCreateManyPupilInputEnvelope";
import { Participation_certificateCreateOrConnectWithoutPupilInput } from "../inputs/Participation_certificateCreateOrConnectWithoutPupilInput";
import { Participation_certificateCreateWithoutPupilInput } from "../inputs/Participation_certificateCreateWithoutPupilInput";
import { Participation_certificateScalarWhereInput } from "../inputs/Participation_certificateScalarWhereInput";
import { Participation_certificateUpdateManyWithWhereWithoutPupilInput } from "../inputs/Participation_certificateUpdateManyWithWhereWithoutPupilInput";
import { Participation_certificateUpdateWithWhereUniqueWithoutPupilInput } from "../inputs/Participation_certificateUpdateWithWhereUniqueWithoutPupilInput";
import { Participation_certificateUpsertWithWhereUniqueWithoutPupilInput } from "../inputs/Participation_certificateUpsertWithWhereUniqueWithoutPupilInput";
import { Participation_certificateWhereUniqueInput } from "../inputs/Participation_certificateWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Participation_certificateUpdateManyWithoutPupilInput {
  @TypeGraphQL.Field(_type => [Participation_certificateCreateWithoutPupilInput], {
    nullable: true
  })
  create?: Participation_certificateCreateWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [Participation_certificateCreateOrConnectWithoutPupilInput], {
    nullable: true
  })
  connectOrCreate?: Participation_certificateCreateOrConnectWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [Participation_certificateUpsertWithWhereUniqueWithoutPupilInput], {
    nullable: true
  })
  upsert?: Participation_certificateUpsertWithWhereUniqueWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => Participation_certificateCreateManyPupilInputEnvelope, {
    nullable: true
  })
  createMany?: Participation_certificateCreateManyPupilInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Participation_certificateWhereUniqueInput], {
    nullable: true
  })
  connect?: Participation_certificateWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Participation_certificateWhereUniqueInput], {
    nullable: true
  })
  set?: Participation_certificateWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Participation_certificateWhereUniqueInput], {
    nullable: true
  })
  disconnect?: Participation_certificateWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Participation_certificateWhereUniqueInput], {
    nullable: true
  })
  delete?: Participation_certificateWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Participation_certificateUpdateWithWhereUniqueWithoutPupilInput], {
    nullable: true
  })
  update?: Participation_certificateUpdateWithWhereUniqueWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [Participation_certificateUpdateManyWithWhereWithoutPupilInput], {
    nullable: true
  })
  updateMany?: Participation_certificateUpdateManyWithWhereWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [Participation_certificateScalarWhereInput], {
    nullable: true
  })
  deleteMany?: Participation_certificateScalarWhereInput[] | undefined;
}
