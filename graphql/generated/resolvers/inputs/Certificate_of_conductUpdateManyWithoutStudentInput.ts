import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Certificate_of_conductCreateManyStudentInputEnvelope } from "../inputs/Certificate_of_conductCreateManyStudentInputEnvelope";
import { Certificate_of_conductCreateOrConnectWithoutStudentInput } from "../inputs/Certificate_of_conductCreateOrConnectWithoutStudentInput";
import { Certificate_of_conductCreateWithoutStudentInput } from "../inputs/Certificate_of_conductCreateWithoutStudentInput";
import { Certificate_of_conductScalarWhereInput } from "../inputs/Certificate_of_conductScalarWhereInput";
import { Certificate_of_conductUpdateManyWithWhereWithoutStudentInput } from "../inputs/Certificate_of_conductUpdateManyWithWhereWithoutStudentInput";
import { Certificate_of_conductUpdateWithWhereUniqueWithoutStudentInput } from "../inputs/Certificate_of_conductUpdateWithWhereUniqueWithoutStudentInput";
import { Certificate_of_conductUpsertWithWhereUniqueWithoutStudentInput } from "../inputs/Certificate_of_conductUpsertWithWhereUniqueWithoutStudentInput";
import { Certificate_of_conductWhereUniqueInput } from "../inputs/Certificate_of_conductWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Certificate_of_conductUpdateManyWithoutStudentInput {
  @TypeGraphQL.Field(_type => [Certificate_of_conductCreateWithoutStudentInput], {
    nullable: true
  })
  create?: Certificate_of_conductCreateWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Certificate_of_conductCreateOrConnectWithoutStudentInput], {
    nullable: true
  })
  connectOrCreate?: Certificate_of_conductCreateOrConnectWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Certificate_of_conductUpsertWithWhereUniqueWithoutStudentInput], {
    nullable: true
  })
  upsert?: Certificate_of_conductUpsertWithWhereUniqueWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => Certificate_of_conductCreateManyStudentInputEnvelope, {
    nullable: true
  })
  createMany?: Certificate_of_conductCreateManyStudentInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Certificate_of_conductWhereUniqueInput], {
    nullable: true
  })
  connect?: Certificate_of_conductWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Certificate_of_conductWhereUniqueInput], {
    nullable: true
  })
  set?: Certificate_of_conductWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Certificate_of_conductWhereUniqueInput], {
    nullable: true
  })
  disconnect?: Certificate_of_conductWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Certificate_of_conductWhereUniqueInput], {
    nullable: true
  })
  delete?: Certificate_of_conductWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Certificate_of_conductUpdateWithWhereUniqueWithoutStudentInput], {
    nullable: true
  })
  update?: Certificate_of_conductUpdateWithWhereUniqueWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Certificate_of_conductUpdateManyWithWhereWithoutStudentInput], {
    nullable: true
  })
  updateMany?: Certificate_of_conductUpdateManyWithWhereWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Certificate_of_conductScalarWhereInput], {
    nullable: true
  })
  deleteMany?: Certificate_of_conductScalarWhereInput[] | undefined;
}
