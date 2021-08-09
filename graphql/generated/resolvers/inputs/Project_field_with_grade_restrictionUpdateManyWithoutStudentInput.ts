import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Project_field_with_grade_restrictionCreateManyStudentInputEnvelope } from "../inputs/Project_field_with_grade_restrictionCreateManyStudentInputEnvelope";
import { Project_field_with_grade_restrictionCreateOrConnectWithoutStudentInput } from "../inputs/Project_field_with_grade_restrictionCreateOrConnectWithoutStudentInput";
import { Project_field_with_grade_restrictionCreateWithoutStudentInput } from "../inputs/Project_field_with_grade_restrictionCreateWithoutStudentInput";
import { Project_field_with_grade_restrictionScalarWhereInput } from "../inputs/Project_field_with_grade_restrictionScalarWhereInput";
import { Project_field_with_grade_restrictionUpdateManyWithWhereWithoutStudentInput } from "../inputs/Project_field_with_grade_restrictionUpdateManyWithWhereWithoutStudentInput";
import { Project_field_with_grade_restrictionUpdateWithWhereUniqueWithoutStudentInput } from "../inputs/Project_field_with_grade_restrictionUpdateWithWhereUniqueWithoutStudentInput";
import { Project_field_with_grade_restrictionUpsertWithWhereUniqueWithoutStudentInput } from "../inputs/Project_field_with_grade_restrictionUpsertWithWhereUniqueWithoutStudentInput";
import { Project_field_with_grade_restrictionWhereUniqueInput } from "../inputs/Project_field_with_grade_restrictionWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Project_field_with_grade_restrictionUpdateManyWithoutStudentInput {
  @TypeGraphQL.Field(_type => [Project_field_with_grade_restrictionCreateWithoutStudentInput], {
    nullable: true
  })
  create?: Project_field_with_grade_restrictionCreateWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_field_with_grade_restrictionCreateOrConnectWithoutStudentInput], {
    nullable: true
  })
  connectOrCreate?: Project_field_with_grade_restrictionCreateOrConnectWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_field_with_grade_restrictionUpsertWithWhereUniqueWithoutStudentInput], {
    nullable: true
  })
  upsert?: Project_field_with_grade_restrictionUpsertWithWhereUniqueWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => Project_field_with_grade_restrictionCreateManyStudentInputEnvelope, {
    nullable: true
  })
  createMany?: Project_field_with_grade_restrictionCreateManyStudentInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Project_field_with_grade_restrictionWhereUniqueInput], {
    nullable: true
  })
  connect?: Project_field_with_grade_restrictionWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_field_with_grade_restrictionWhereUniqueInput], {
    nullable: true
  })
  set?: Project_field_with_grade_restrictionWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_field_with_grade_restrictionWhereUniqueInput], {
    nullable: true
  })
  disconnect?: Project_field_with_grade_restrictionWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_field_with_grade_restrictionWhereUniqueInput], {
    nullable: true
  })
  delete?: Project_field_with_grade_restrictionWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_field_with_grade_restrictionUpdateWithWhereUniqueWithoutStudentInput], {
    nullable: true
  })
  update?: Project_field_with_grade_restrictionUpdateWithWhereUniqueWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_field_with_grade_restrictionUpdateManyWithWhereWithoutStudentInput], {
    nullable: true
  })
  updateMany?: Project_field_with_grade_restrictionUpdateManyWithWhereWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_field_with_grade_restrictionScalarWhereInput], {
    nullable: true
  })
  deleteMany?: Project_field_with_grade_restrictionScalarWhereInput[] | undefined;
}
