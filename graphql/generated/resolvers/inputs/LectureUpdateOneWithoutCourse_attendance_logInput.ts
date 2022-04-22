import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { LectureCreateOrConnectWithoutCourse_attendance_logInput } from "../inputs/LectureCreateOrConnectWithoutCourse_attendance_logInput";
import { LectureCreateWithoutCourse_attendance_logInput } from "../inputs/LectureCreateWithoutCourse_attendance_logInput";
import { LectureUpdateWithoutCourse_attendance_logInput } from "../inputs/LectureUpdateWithoutCourse_attendance_logInput";
import { LectureUpsertWithoutCourse_attendance_logInput } from "../inputs/LectureUpsertWithoutCourse_attendance_logInput";
import { LectureWhereUniqueInput } from "../inputs/LectureWhereUniqueInput";

@TypeGraphQL.InputType("LectureUpdateOneWithoutCourse_attendance_logInput", {
  isAbstract: true
})
export class LectureUpdateOneWithoutCourse_attendance_logInput {
  @TypeGraphQL.Field(_type => LectureCreateWithoutCourse_attendance_logInput, {
    nullable: true
  })
  create?: LectureCreateWithoutCourse_attendance_logInput | undefined;

  @TypeGraphQL.Field(_type => LectureCreateOrConnectWithoutCourse_attendance_logInput, {
    nullable: true
  })
  connectOrCreate?: LectureCreateOrConnectWithoutCourse_attendance_logInput | undefined;

  @TypeGraphQL.Field(_type => LectureUpsertWithoutCourse_attendance_logInput, {
    nullable: true
  })
  upsert?: LectureUpsertWithoutCourse_attendance_logInput | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  disconnect?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  delete?: boolean | undefined;

  @TypeGraphQL.Field(_type => LectureWhereUniqueInput, {
    nullable: true
  })
  connect?: LectureWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => LectureUpdateWithoutCourse_attendance_logInput, {
    nullable: true
  })
  update?: LectureUpdateWithoutCourse_attendance_logInput | undefined;
}
