import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { LectureCreateManySubcourseInputEnvelope } from "../inputs/LectureCreateManySubcourseInputEnvelope";
import { LectureCreateOrConnectWithoutSubcourseInput } from "../inputs/LectureCreateOrConnectWithoutSubcourseInput";
import { LectureCreateWithoutSubcourseInput } from "../inputs/LectureCreateWithoutSubcourseInput";
import { LectureScalarWhereInput } from "../inputs/LectureScalarWhereInput";
import { LectureUpdateManyWithWhereWithoutSubcourseInput } from "../inputs/LectureUpdateManyWithWhereWithoutSubcourseInput";
import { LectureUpdateWithWhereUniqueWithoutSubcourseInput } from "../inputs/LectureUpdateWithWhereUniqueWithoutSubcourseInput";
import { LectureUpsertWithWhereUniqueWithoutSubcourseInput } from "../inputs/LectureUpsertWithWhereUniqueWithoutSubcourseInput";
import { LectureWhereUniqueInput } from "../inputs/LectureWhereUniqueInput";

@TypeGraphQL.InputType("LectureUpdateManyWithoutSubcourseInput", {
  isAbstract: true
})
export class LectureUpdateManyWithoutSubcourseInput {
  @TypeGraphQL.Field(_type => [LectureCreateWithoutSubcourseInput], {
    nullable: true
  })
  create?: LectureCreateWithoutSubcourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [LectureCreateOrConnectWithoutSubcourseInput], {
    nullable: true
  })
  connectOrCreate?: LectureCreateOrConnectWithoutSubcourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [LectureUpsertWithWhereUniqueWithoutSubcourseInput], {
    nullable: true
  })
  upsert?: LectureUpsertWithWhereUniqueWithoutSubcourseInput[] | undefined;

  @TypeGraphQL.Field(_type => LectureCreateManySubcourseInputEnvelope, {
    nullable: true
  })
  createMany?: LectureCreateManySubcourseInputEnvelope | undefined;

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

  @TypeGraphQL.Field(_type => [LectureWhereUniqueInput], {
    nullable: true
  })
  connect?: LectureWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [LectureUpdateWithWhereUniqueWithoutSubcourseInput], {
    nullable: true
  })
  update?: LectureUpdateWithWhereUniqueWithoutSubcourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [LectureUpdateManyWithWhereWithoutSubcourseInput], {
    nullable: true
  })
  updateMany?: LectureUpdateManyWithWhereWithoutSubcourseInput[] | undefined;

  @TypeGraphQL.Field(_type => [LectureScalarWhereInput], {
    nullable: true
  })
  deleteMany?: LectureScalarWhereInput[] | undefined;
}
