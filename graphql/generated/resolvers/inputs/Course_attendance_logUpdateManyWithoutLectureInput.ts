import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_attendance_logCreateManyLectureInputEnvelope } from "../inputs/Course_attendance_logCreateManyLectureInputEnvelope";
import { Course_attendance_logCreateOrConnectWithoutLectureInput } from "../inputs/Course_attendance_logCreateOrConnectWithoutLectureInput";
import { Course_attendance_logCreateWithoutLectureInput } from "../inputs/Course_attendance_logCreateWithoutLectureInput";
import { Course_attendance_logScalarWhereInput } from "../inputs/Course_attendance_logScalarWhereInput";
import { Course_attendance_logUpdateManyWithWhereWithoutLectureInput } from "../inputs/Course_attendance_logUpdateManyWithWhereWithoutLectureInput";
import { Course_attendance_logUpdateWithWhereUniqueWithoutLectureInput } from "../inputs/Course_attendance_logUpdateWithWhereUniqueWithoutLectureInput";
import { Course_attendance_logUpsertWithWhereUniqueWithoutLectureInput } from "../inputs/Course_attendance_logUpsertWithWhereUniqueWithoutLectureInput";
import { Course_attendance_logWhereUniqueInput } from "../inputs/Course_attendance_logWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_attendance_logUpdateManyWithoutLectureInput {
  @TypeGraphQL.Field(_type => [Course_attendance_logCreateWithoutLectureInput], {
    nullable: true
  })
  create?: Course_attendance_logCreateWithoutLectureInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_attendance_logCreateOrConnectWithoutLectureInput], {
    nullable: true
  })
  connectOrCreate?: Course_attendance_logCreateOrConnectWithoutLectureInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_attendance_logUpsertWithWhereUniqueWithoutLectureInput], {
    nullable: true
  })
  upsert?: Course_attendance_logUpsertWithWhereUniqueWithoutLectureInput[] | undefined;

  @TypeGraphQL.Field(_type => Course_attendance_logCreateManyLectureInputEnvelope, {
    nullable: true
  })
  createMany?: Course_attendance_logCreateManyLectureInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Course_attendance_logWhereUniqueInput], {
    nullable: true
  })
  connect?: Course_attendance_logWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_attendance_logWhereUniqueInput], {
    nullable: true
  })
  set?: Course_attendance_logWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_attendance_logWhereUniqueInput], {
    nullable: true
  })
  disconnect?: Course_attendance_logWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_attendance_logWhereUniqueInput], {
    nullable: true
  })
  delete?: Course_attendance_logWhereUniqueInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_attendance_logUpdateWithWhereUniqueWithoutLectureInput], {
    nullable: true
  })
  update?: Course_attendance_logUpdateWithWhereUniqueWithoutLectureInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_attendance_logUpdateManyWithWhereWithoutLectureInput], {
    nullable: true
  })
  updateMany?: Course_attendance_logUpdateManyWithWhereWithoutLectureInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_attendance_logScalarWhereInput], {
    nullable: true
  })
  deleteMany?: Course_attendance_logScalarWhereInput[] | undefined;
}
