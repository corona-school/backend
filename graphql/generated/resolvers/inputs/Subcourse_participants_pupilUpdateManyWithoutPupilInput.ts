import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_participants_pupilCreateManyPupilInputEnvelope } from "../inputs/Subcourse_participants_pupilCreateManyPupilInputEnvelope";
import { Subcourse_participants_pupilCreateOrConnectWithoutPupilInput } from "../inputs/Subcourse_participants_pupilCreateOrConnectWithoutPupilInput";
import { Subcourse_participants_pupilCreateWithoutPupilInput } from "../inputs/Subcourse_participants_pupilCreateWithoutPupilInput";
import { Subcourse_participants_pupilScalarWhereInput } from "../inputs/Subcourse_participants_pupilScalarWhereInput";
import { Subcourse_participants_pupilUpdateManyWithWhereWithoutPupilInput } from "../inputs/Subcourse_participants_pupilUpdateManyWithWhereWithoutPupilInput";
import { Subcourse_participants_pupilUpdateWithWhereUniqueWithoutPupilInput } from "../inputs/Subcourse_participants_pupilUpdateWithWhereUniqueWithoutPupilInput";
import { Subcourse_participants_pupilUpsertWithWhereUniqueWithoutPupilInput } from "../inputs/Subcourse_participants_pupilUpsertWithWhereUniqueWithoutPupilInput";
import { Subcourse_participants_pupilWhereUniqueInput } from "../inputs/Subcourse_participants_pupilWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Subcourse_participants_pupilUpdateManyWithoutPupilInput {
  @TypeGraphQL.Field(_type => [Subcourse_participants_pupilCreateWithoutPupilInput], {
    nullable: true
  })
  create?: Subcourse_participants_pupilCreateWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_participants_pupilCreateOrConnectWithoutPupilInput], {
    nullable: true
  })
  connectOrCreate?: Subcourse_participants_pupilCreateOrConnectWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_participants_pupilUpsertWithWhereUniqueWithoutPupilInput], {
    nullable: true
  })
  upsert?: Subcourse_participants_pupilUpsertWithWhereUniqueWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => Subcourse_participants_pupilCreateManyPupilInputEnvelope, {
    nullable: true
  })
  createMany?: Subcourse_participants_pupilCreateManyPupilInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_participants_pupilWhereUniqueInput], {
    nullable: true
  })
  connect?: Subcourse_participants_pupilWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_participants_pupilWhereUniqueInput], {
    nullable: true
  })
  set?: Subcourse_participants_pupilWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_participants_pupilWhereUniqueInput], {
    nullable: true
  })
  disconnect?: Subcourse_participants_pupilWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_participants_pupilWhereUniqueInput], {
    nullable: true
  })
  delete?: Subcourse_participants_pupilWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_participants_pupilUpdateWithWhereUniqueWithoutPupilInput], {
    nullable: true
  })
  update?: Subcourse_participants_pupilUpdateWithWhereUniqueWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_participants_pupilUpdateManyWithWhereWithoutPupilInput], {
    nullable: true
  })
  updateMany?: Subcourse_participants_pupilUpdateManyWithWhereWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_participants_pupilScalarWhereInput], {
    nullable: true
  })
  deleteMany?: Subcourse_participants_pupilScalarWhereInput[] | undefined;
}
