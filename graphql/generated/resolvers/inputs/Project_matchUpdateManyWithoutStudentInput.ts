import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Project_matchCreateManyStudentInputEnvelope } from "../inputs/Project_matchCreateManyStudentInputEnvelope";
import { Project_matchCreateOrConnectWithoutStudentInput } from "../inputs/Project_matchCreateOrConnectWithoutStudentInput";
import { Project_matchCreateWithoutStudentInput } from "../inputs/Project_matchCreateWithoutStudentInput";
import { Project_matchScalarWhereInput } from "../inputs/Project_matchScalarWhereInput";
import { Project_matchUpdateManyWithWhereWithoutStudentInput } from "../inputs/Project_matchUpdateManyWithWhereWithoutStudentInput";
import { Project_matchUpdateWithWhereUniqueWithoutStudentInput } from "../inputs/Project_matchUpdateWithWhereUniqueWithoutStudentInput";
import { Project_matchUpsertWithWhereUniqueWithoutStudentInput } from "../inputs/Project_matchUpsertWithWhereUniqueWithoutStudentInput";
import { Project_matchWhereUniqueInput } from "../inputs/Project_matchWhereUniqueInput";

@TypeGraphQL.InputType("Project_matchUpdateManyWithoutStudentInput", {
  isAbstract: true
})
export class Project_matchUpdateManyWithoutStudentInput {
  @TypeGraphQL.Field(_type => [Project_matchCreateWithoutStudentInput], {
    nullable: true
  })
  create?: Project_matchCreateWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_matchCreateOrConnectWithoutStudentInput], {
    nullable: true
  })
  connectOrCreate?: Project_matchCreateOrConnectWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_matchUpsertWithWhereUniqueWithoutStudentInput], {
    nullable: true
  })
  upsert?: Project_matchUpsertWithWhereUniqueWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => Project_matchCreateManyStudentInputEnvelope, {
    nullable: true
  })
  createMany?: Project_matchCreateManyStudentInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Project_matchWhereUniqueInput], {
    nullable: true
  })
  set?: Project_matchWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_matchWhereUniqueInput], {
    nullable: true
  })
  disconnect?: Project_matchWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_matchWhereUniqueInput], {
    nullable: true
  })
  delete?: Project_matchWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_matchWhereUniqueInput], {
    nullable: true
  })
  connect?: Project_matchWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_matchUpdateWithWhereUniqueWithoutStudentInput], {
    nullable: true
  })
  update?: Project_matchUpdateWithWhereUniqueWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_matchUpdateManyWithWhereWithoutStudentInput], {
    nullable: true
  })
  updateMany?: Project_matchUpdateManyWithWhereWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_matchScalarWhereInput], {
    nullable: true
  })
  deleteMany?: Project_matchScalarWhereInput[] | undefined;
}
