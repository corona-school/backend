import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Participation_certificateCreateManyStudentInputEnvelope } from "../inputs/Participation_certificateCreateManyStudentInputEnvelope";
import { Participation_certificateCreateOrConnectWithoutStudentInput } from "../inputs/Participation_certificateCreateOrConnectWithoutStudentInput";
import { Participation_certificateCreateWithoutStudentInput } from "../inputs/Participation_certificateCreateWithoutStudentInput";
import { Participation_certificateScalarWhereInput } from "../inputs/Participation_certificateScalarWhereInput";
import { Participation_certificateUpdateManyWithWhereWithoutStudentInput } from "../inputs/Participation_certificateUpdateManyWithWhereWithoutStudentInput";
import { Participation_certificateUpdateWithWhereUniqueWithoutStudentInput } from "../inputs/Participation_certificateUpdateWithWhereUniqueWithoutStudentInput";
import { Participation_certificateUpsertWithWhereUniqueWithoutStudentInput } from "../inputs/Participation_certificateUpsertWithWhereUniqueWithoutStudentInput";
import { Participation_certificateWhereUniqueInput } from "../inputs/Participation_certificateWhereUniqueInput";

@TypeGraphQL.InputType("Participation_certificateUpdateManyWithoutStudentInput", {
  isAbstract: true
})
export class Participation_certificateUpdateManyWithoutStudentInput {
  @TypeGraphQL.Field(_type => [Participation_certificateCreateWithoutStudentInput], {
    nullable: true
  })
  create?: Participation_certificateCreateWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Participation_certificateCreateOrConnectWithoutStudentInput], {
    nullable: true
  })
  connectOrCreate?: Participation_certificateCreateOrConnectWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Participation_certificateUpsertWithWhereUniqueWithoutStudentInput], {
    nullable: true
  })
  upsert?: Participation_certificateUpsertWithWhereUniqueWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => Participation_certificateCreateManyStudentInputEnvelope, {
    nullable: true
  })
  createMany?: Participation_certificateCreateManyStudentInputEnvelope | undefined;

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

  @TypeGraphQL.Field(_type => [Participation_certificateWhereUniqueInput], {
    nullable: true
  })
  connect?: Participation_certificateWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Participation_certificateUpdateWithWhereUniqueWithoutStudentInput], {
    nullable: true
  })
  update?: Participation_certificateUpdateWithWhereUniqueWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Participation_certificateUpdateManyWithWhereWithoutStudentInput], {
    nullable: true
  })
  updateMany?: Participation_certificateUpdateManyWithWhereWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Participation_certificateScalarWhereInput], {
    nullable: true
  })
  deleteMany?: Participation_certificateScalarWhereInput[] | undefined;
}
