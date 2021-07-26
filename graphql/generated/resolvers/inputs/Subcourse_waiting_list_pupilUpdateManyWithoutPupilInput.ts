import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_waiting_list_pupilCreateManyPupilInputEnvelope } from "../inputs/Subcourse_waiting_list_pupilCreateManyPupilInputEnvelope";
import { Subcourse_waiting_list_pupilCreateOrConnectWithoutPupilInput } from "../inputs/Subcourse_waiting_list_pupilCreateOrConnectWithoutPupilInput";
import { Subcourse_waiting_list_pupilCreateWithoutPupilInput } from "../inputs/Subcourse_waiting_list_pupilCreateWithoutPupilInput";
import { Subcourse_waiting_list_pupilScalarWhereInput } from "../inputs/Subcourse_waiting_list_pupilScalarWhereInput";
import { Subcourse_waiting_list_pupilUpdateManyWithWhereWithoutPupilInput } from "../inputs/Subcourse_waiting_list_pupilUpdateManyWithWhereWithoutPupilInput";
import { Subcourse_waiting_list_pupilUpdateWithWhereUniqueWithoutPupilInput } from "../inputs/Subcourse_waiting_list_pupilUpdateWithWhereUniqueWithoutPupilInput";
import { Subcourse_waiting_list_pupilUpsertWithWhereUniqueWithoutPupilInput } from "../inputs/Subcourse_waiting_list_pupilUpsertWithWhereUniqueWithoutPupilInput";
import { Subcourse_waiting_list_pupilWhereUniqueInput } from "../inputs/Subcourse_waiting_list_pupilWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Subcourse_waiting_list_pupilUpdateManyWithoutPupilInput {
  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilCreateWithoutPupilInput], {
    nullable: true
  })
  create?: Subcourse_waiting_list_pupilCreateWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilCreateOrConnectWithoutPupilInput], {
    nullable: true
  })
  connectOrCreate?: Subcourse_waiting_list_pupilCreateOrConnectWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilUpsertWithWhereUniqueWithoutPupilInput], {
    nullable: true
  })
  upsert?: Subcourse_waiting_list_pupilUpsertWithWhereUniqueWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilCreateManyPupilInputEnvelope, {
    nullable: true
  })
  createMany?: Subcourse_waiting_list_pupilCreateManyPupilInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilWhereUniqueInput], {
    nullable: true
  })
  connect?: Subcourse_waiting_list_pupilWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilWhereUniqueInput], {
    nullable: true
  })
  set?: Subcourse_waiting_list_pupilWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilWhereUniqueInput], {
    nullable: true
  })
  disconnect?: Subcourse_waiting_list_pupilWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilWhereUniqueInput], {
    nullable: true
  })
  delete?: Subcourse_waiting_list_pupilWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilUpdateWithWhereUniqueWithoutPupilInput], {
    nullable: true
  })
  update?: Subcourse_waiting_list_pupilUpdateWithWhereUniqueWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilUpdateManyWithWhereWithoutPupilInput], {
    nullable: true
  })
  updateMany?: Subcourse_waiting_list_pupilUpdateManyWithWhereWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [Subcourse_waiting_list_pupilScalarWhereInput], {
    nullable: true
  })
  deleteMany?: Subcourse_waiting_list_pupilScalarWhereInput[] | undefined;
}
