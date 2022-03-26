import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Project_matchCreateManyPupilInputEnvelope } from "../inputs/Project_matchCreateManyPupilInputEnvelope";
import { Project_matchCreateOrConnectWithoutPupilInput } from "../inputs/Project_matchCreateOrConnectWithoutPupilInput";
import { Project_matchCreateWithoutPupilInput } from "../inputs/Project_matchCreateWithoutPupilInput";
import { Project_matchScalarWhereInput } from "../inputs/Project_matchScalarWhereInput";
import { Project_matchUpdateManyWithWhereWithoutPupilInput } from "../inputs/Project_matchUpdateManyWithWhereWithoutPupilInput";
import { Project_matchUpdateWithWhereUniqueWithoutPupilInput } from "../inputs/Project_matchUpdateWithWhereUniqueWithoutPupilInput";
import { Project_matchUpsertWithWhereUniqueWithoutPupilInput } from "../inputs/Project_matchUpsertWithWhereUniqueWithoutPupilInput";
import { Project_matchWhereUniqueInput } from "../inputs/Project_matchWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Project_matchUpdateManyWithoutPupilInput {
  @TypeGraphQL.Field(_type => [Project_matchCreateWithoutPupilInput], {
    nullable: true
  })
  create?: Project_matchCreateWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_matchCreateOrConnectWithoutPupilInput], {
    nullable: true
  })
  connectOrCreate?: Project_matchCreateOrConnectWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_matchUpsertWithWhereUniqueWithoutPupilInput], {
    nullable: true
  })
  upsert?: Project_matchUpsertWithWhereUniqueWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => Project_matchCreateManyPupilInputEnvelope, {
    nullable: true
  })
  createMany?: Project_matchCreateManyPupilInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Project_matchWhereUniqueInput], {
    nullable: true
  })
  connect?: Project_matchWhereUniqueInput[] | undefined;

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

  @TypeGraphQL.Field(_type => [Project_matchUpdateWithWhereUniqueWithoutPupilInput], {
    nullable: true
  })
  update?: Project_matchUpdateWithWhereUniqueWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_matchUpdateManyWithWhereWithoutPupilInput], {
    nullable: true
  })
  updateMany?: Project_matchUpdateManyWithWhereWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_matchScalarWhereInput], {
    nullable: true
  })
  deleteMany?: Project_matchScalarWhereInput[] | undefined;
}
