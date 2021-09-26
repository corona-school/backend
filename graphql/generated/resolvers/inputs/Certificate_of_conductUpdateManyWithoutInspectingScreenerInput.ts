import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Certificate_of_conductCreateManyInspectingScreenerInputEnvelope } from "../inputs/Certificate_of_conductCreateManyInspectingScreenerInputEnvelope";
import { Certificate_of_conductCreateOrConnectWithoutInspectingScreenerInput } from "../inputs/Certificate_of_conductCreateOrConnectWithoutInspectingScreenerInput";
import { Certificate_of_conductCreateWithoutInspectingScreenerInput } from "../inputs/Certificate_of_conductCreateWithoutInspectingScreenerInput";
import { Certificate_of_conductScalarWhereInput } from "../inputs/Certificate_of_conductScalarWhereInput";
import { Certificate_of_conductUpdateManyWithWhereWithoutInspectingScreenerInput } from "../inputs/Certificate_of_conductUpdateManyWithWhereWithoutInspectingScreenerInput";
import { Certificate_of_conductUpdateWithWhereUniqueWithoutInspectingScreenerInput } from "../inputs/Certificate_of_conductUpdateWithWhereUniqueWithoutInspectingScreenerInput";
import { Certificate_of_conductUpsertWithWhereUniqueWithoutInspectingScreenerInput } from "../inputs/Certificate_of_conductUpsertWithWhereUniqueWithoutInspectingScreenerInput";
import { Certificate_of_conductWhereUniqueInput } from "../inputs/Certificate_of_conductWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Certificate_of_conductUpdateManyWithoutInspectingScreenerInput {
  @TypeGraphQL.Field(_type => [Certificate_of_conductCreateWithoutInspectingScreenerInput], {
    nullable: true
  })
  create?: Certificate_of_conductCreateWithoutInspectingScreenerInput[] | undefined;

  @TypeGraphQL.Field(_type => [Certificate_of_conductCreateOrConnectWithoutInspectingScreenerInput], {
    nullable: true
  })
  connectOrCreate?: Certificate_of_conductCreateOrConnectWithoutInspectingScreenerInput[] | undefined;

  @TypeGraphQL.Field(_type => [Certificate_of_conductUpsertWithWhereUniqueWithoutInspectingScreenerInput], {
    nullable: true
  })
  upsert?: Certificate_of_conductUpsertWithWhereUniqueWithoutInspectingScreenerInput[] | undefined;

  @TypeGraphQL.Field(_type => Certificate_of_conductCreateManyInspectingScreenerInputEnvelope, {
    nullable: true
  })
  createMany?: Certificate_of_conductCreateManyInspectingScreenerInputEnvelope | undefined;

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

  @TypeGraphQL.Field(_type => [Certificate_of_conductUpdateWithWhereUniqueWithoutInspectingScreenerInput], {
    nullable: true
  })
  update?: Certificate_of_conductUpdateWithWhereUniqueWithoutInspectingScreenerInput[] | undefined;

  @TypeGraphQL.Field(_type => [Certificate_of_conductUpdateManyWithWhereWithoutInspectingScreenerInput], {
    nullable: true
  })
  updateMany?: Certificate_of_conductUpdateManyWithWhereWithoutInspectingScreenerInput[] | undefined;

  @TypeGraphQL.Field(_type => [Certificate_of_conductScalarWhereInput], {
    nullable: true
  })
  deleteMany?: Certificate_of_conductScalarWhereInput[] | undefined;
}
