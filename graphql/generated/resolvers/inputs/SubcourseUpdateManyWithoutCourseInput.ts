import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { SubcourseCreateManyCourseInputEnvelope } from "../inputs/SubcourseCreateManyCourseInputEnvelope";
import { SubcourseCreateOrConnectWithoutCourseInput } from "../inputs/SubcourseCreateOrConnectWithoutCourseInput";
import { SubcourseCreateWithoutCourseInput } from "../inputs/SubcourseCreateWithoutCourseInput";
import { SubcourseScalarWhereInput } from "../inputs/SubcourseScalarWhereInput";
import { SubcourseUpdateManyWithWhereWithoutCourseInput } from "../inputs/SubcourseUpdateManyWithWhereWithoutCourseInput";
import { SubcourseUpdateWithWhereUniqueWithoutCourseInput } from "../inputs/SubcourseUpdateWithWhereUniqueWithoutCourseInput";
import { SubcourseUpsertWithWhereUniqueWithoutCourseInput } from "../inputs/SubcourseUpsertWithWhereUniqueWithoutCourseInput";
import { SubcourseWhereUniqueInput } from "../inputs/SubcourseWhereUniqueInput";

@TypeGraphQL.InputType("SubcourseUpdateManyWithoutCourseInput", {
  isAbstract: true
})
export class SubcourseUpdateManyWithoutCourseInput {
  @TypeGraphQL.Field(_type => [SubcourseCreateWithoutCourseInput], {
    nullable: true
  })
  create?: SubcourseCreateWithoutCourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [SubcourseCreateOrConnectWithoutCourseInput], {
    nullable: true
  })
  connectOrCreate?: SubcourseCreateOrConnectWithoutCourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [SubcourseUpsertWithWhereUniqueWithoutCourseInput], {
    nullable: true
  })
  upsert?: SubcourseUpsertWithWhereUniqueWithoutCourseInput[] | undefined;

  @TypeGraphQL.Field(_type => SubcourseCreateManyCourseInputEnvelope, {
    nullable: true
  })
  createMany?: SubcourseCreateManyCourseInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [SubcourseWhereUniqueInput], {
    nullable: true
  })
  set?: SubcourseWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [SubcourseWhereUniqueInput], {
    nullable: true
  })
  disconnect?: SubcourseWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [SubcourseWhereUniqueInput], {
    nullable: true
  })
  delete?: SubcourseWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [SubcourseWhereUniqueInput], {
    nullable: true
  })
  connect?: SubcourseWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [SubcourseUpdateWithWhereUniqueWithoutCourseInput], {
    nullable: true
  })
  update?: SubcourseUpdateWithWhereUniqueWithoutCourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [SubcourseUpdateManyWithWhereWithoutCourseInput], {
    nullable: true
  })
  updateMany?: SubcourseUpdateManyWithWhereWithoutCourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [SubcourseScalarWhereInput], {
    nullable: true
  })
  deleteMany?: SubcourseScalarWhereInput[] | undefined;
}
