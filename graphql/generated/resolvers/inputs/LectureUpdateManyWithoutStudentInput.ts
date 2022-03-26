import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { LectureCreateManyStudentInputEnvelope } from "../inputs/LectureCreateManyStudentInputEnvelope";
import { LectureCreateOrConnectWithoutStudentInput } from "../inputs/LectureCreateOrConnectWithoutStudentInput";
import { LectureCreateWithoutStudentInput } from "../inputs/LectureCreateWithoutStudentInput";
import { LectureScalarWhereInput } from "../inputs/LectureScalarWhereInput";
import { LectureUpdateManyWithWhereWithoutStudentInput } from "../inputs/LectureUpdateManyWithWhereWithoutStudentInput";
import { LectureUpdateWithWhereUniqueWithoutStudentInput } from "../inputs/LectureUpdateWithWhereUniqueWithoutStudentInput";
import { LectureUpsertWithWhereUniqueWithoutStudentInput } from "../inputs/LectureUpsertWithWhereUniqueWithoutStudentInput";
import { LectureWhereUniqueInput } from "../inputs/LectureWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class LectureUpdateManyWithoutStudentInput {
  @TypeGraphQL.Field(_type => [LectureCreateWithoutStudentInput], {
    nullable: true
  })
  create?: LectureCreateWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [LectureCreateOrConnectWithoutStudentInput], {
    nullable: true
  })
  connectOrCreate?: LectureCreateOrConnectWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [LectureUpsertWithWhereUniqueWithoutStudentInput], {
    nullable: true
  })
  upsert?: LectureUpsertWithWhereUniqueWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => LectureCreateManyStudentInputEnvelope, {
    nullable: true
  })
  createMany?: LectureCreateManyStudentInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [LectureWhereUniqueInput], {
    nullable: true
  })
  connect?: LectureWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [LectureWhereUniqueInput], {
    nullable: true
  })
  set?: LectureWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [LectureWhereUniqueInput], {
    nullable: true
  })
  disconnect?: LectureWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [LectureWhereUniqueInput], {
    nullable: true
  })
  delete?: LectureWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [LectureUpdateWithWhereUniqueWithoutStudentInput], {
    nullable: true
  })
  update?: LectureUpdateWithWhereUniqueWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [LectureUpdateManyWithWhereWithoutStudentInput], {
    nullable: true
  })
  updateMany?: LectureUpdateManyWithWhereWithoutStudentInput[] | undefined;

  @TypeGraphQL.Field(_type => [LectureScalarWhereInput], {
    nullable: true
  })
  deleteMany?: LectureScalarWhereInput[] | undefined;
}
