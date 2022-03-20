import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { MatchCreateManyStudentInputEnvelope } from "../inputs/MatchCreateManyStudentInputEnvelope";
import { MatchCreateOrConnectWithoutStudentInput } from "../inputs/MatchCreateOrConnectWithoutStudentInput";
import { MatchCreateWithoutStudentInput } from "../inputs/MatchCreateWithoutStudentInput";
import { MatchScalarWhereInput } from "../inputs/MatchScalarWhereInput";
import { MatchUpdateManyWithWhereWithoutStudentInput } from "../inputs/MatchUpdateManyWithWhereWithoutStudentInput";
import { MatchUpdateWithWhereUniqueWithoutStudentInput } from "../inputs/MatchUpdateWithWhereUniqueWithoutStudentInput";
import { MatchUpsertWithWhereUniqueWithoutStudentInput } from "../inputs/MatchUpsertWithWhereUniqueWithoutStudentInput";
import { MatchWhereUniqueInput } from "../inputs/MatchWhereUniqueInput";

@TypeGraphQL.InputType("MatchUpdateManyWithoutStudentInput", {
  isAbstract: true
})
export class MatchUpdateManyWithoutStudentInput {
  @TypeGraphQL.Field(_type => [MatchCreateWithoutStudentInput], {
    nullable: true
  })
  create?: MatchCreateWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [MatchCreateOrConnectWithoutStudentInput], {
    nullable: true
  })
  connectOrCreate?: MatchCreateOrConnectWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [MatchUpsertWithWhereUniqueWithoutStudentInput], {
    nullable: true
  })
  upsert?: MatchUpsertWithWhereUniqueWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => MatchCreateManyStudentInputEnvelope, {
    nullable: true
  })
  createMany?: MatchCreateManyStudentInputEnvelope | undefined;

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

  @TypeGraphQL.Field(_type => [MatchUpdateWithWhereUniqueWithoutStudentInput], {
    nullable: true
  })
  update?: MatchUpdateWithWhereUniqueWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [MatchUpdateManyWithWhereWithoutStudentInput], {
    nullable: true
  })
  updateMany?: MatchUpdateManyWithWhereWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [MatchScalarWhereInput], {
    nullable: true
  })
  deleteMany?: MatchScalarWhereInput[] | undefined;
}
