import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseCreateManyStudentInputEnvelope } from "../inputs/CourseCreateManyStudentInputEnvelope";
import { CourseCreateOrConnectWithoutStudentInput } from "../inputs/CourseCreateOrConnectWithoutStudentInput";
import { CourseCreateWithoutStudentInput } from "../inputs/CourseCreateWithoutStudentInput";
import { CourseScalarWhereInput } from "../inputs/CourseScalarWhereInput";
import { CourseUpdateManyWithWhereWithoutStudentInput } from "../inputs/CourseUpdateManyWithWhereWithoutStudentInput";
import { CourseUpdateWithWhereUniqueWithoutStudentInput } from "../inputs/CourseUpdateWithWhereUniqueWithoutStudentInput";
import { CourseUpsertWithWhereUniqueWithoutStudentInput } from "../inputs/CourseUpsertWithWhereUniqueWithoutStudentInput";
import { CourseWhereUniqueInput } from "../inputs/CourseWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class CourseUpdateManyWithoutStudentInput {
  @TypeGraphQL.Field(_type => [CourseCreateWithoutStudentInput], {
    nullable: true
  })
  create?: CourseCreateWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [CourseCreateOrConnectWithoutStudentInput], {
    nullable: true
  })
  connectOrCreate?: CourseCreateOrConnectWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [CourseUpsertWithWhereUniqueWithoutStudentInput], {
    nullable: true
  })
  upsert?: CourseUpsertWithWhereUniqueWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => CourseCreateManyStudentInputEnvelope, {
    nullable: true
  })
  createMany?: CourseCreateManyStudentInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [CourseWhereUniqueInput], {
    nullable: true
  })
  connect?: CourseWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [CourseWhereUniqueInput], {
    nullable: true
  })
  set?: CourseWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [CourseWhereUniqueInput], {
    nullable: true
  })
  disconnect?: CourseWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [CourseWhereUniqueInput], {
    nullable: true
  })
  delete?: CourseWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [CourseUpdateWithWhereUniqueWithoutStudentInput], {
    nullable: true
  })
  update?: CourseUpdateWithWhereUniqueWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [CourseUpdateManyWithWhereWithoutStudentInput], {
    nullable: true
  })
  updateMany?: CourseUpdateManyWithWhereWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [CourseScalarWhereInput], {
    nullable: true
  })
  deleteMany?: CourseScalarWhereInput[] | undefined;
}
