import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { MatchCreateManyPupilInputEnvelope } from "../inputs/MatchCreateManyPupilInputEnvelope";
import { MatchCreateOrConnectWithoutPupilInput } from "../inputs/MatchCreateOrConnectWithoutPupilInput";
import { MatchCreateWithoutPupilInput } from "../inputs/MatchCreateWithoutPupilInput";
import { MatchScalarWhereInput } from "../inputs/MatchScalarWhereInput";
import { MatchUpdateManyWithWhereWithoutPupilInput } from "../inputs/MatchUpdateManyWithWhereWithoutPupilInput";
import { MatchUpdateWithWhereUniqueWithoutPupilInput } from "../inputs/MatchUpdateWithWhereUniqueWithoutPupilInput";
import { MatchUpsertWithWhereUniqueWithoutPupilInput } from "../inputs/MatchUpsertWithWhereUniqueWithoutPupilInput";
import { MatchWhereUniqueInput } from "../inputs/MatchWhereUniqueInput";

@TypeGraphQL.InputType("MatchUpdateManyWithoutPupilInput", {
  isAbstract: true
})
export class MatchUpdateManyWithoutPupilInput {
  @TypeGraphQL.Field(_type => [MatchCreateWithoutPupilInput], {
    nullable: true
  })
  create?: MatchCreateWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [MatchCreateOrConnectWithoutPupilInput], {
    nullable: true
  })
  connectOrCreate?: MatchCreateOrConnectWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [MatchUpsertWithWhereUniqueWithoutPupilInput], {
    nullable: true
  })
  upsert?: MatchUpsertWithWhereUniqueWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => MatchCreateManyPupilInputEnvelope, {
    nullable: true
  })
  createMany?: MatchCreateManyPupilInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [MatchWhereUniqueInput], {
    nullable: true
  })
  set?: MatchWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [MatchWhereUniqueInput], {
    nullable: true
  })
  disconnect?: MatchWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [MatchWhereUniqueInput], {
    nullable: true
  })
  delete?: MatchWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [MatchWhereUniqueInput], {
    nullable: true
  })
  connect?: MatchWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [MatchUpdateWithWhereUniqueWithoutPupilInput], {
    nullable: true
  })
  update?: MatchUpdateWithWhereUniqueWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [MatchUpdateManyWithWhereWithoutPupilInput], {
    nullable: true
  })
  updateMany?: MatchUpdateManyWithWhereWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [MatchScalarWhereInput], {
    nullable: true
  })
  deleteMany?: MatchScalarWhereInput[] | undefined;
}
