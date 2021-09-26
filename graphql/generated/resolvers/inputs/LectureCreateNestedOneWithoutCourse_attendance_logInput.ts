import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { LectureCreateOrConnectWithoutCourse_attendance_logInput } from "../inputs/LectureCreateOrConnectWithoutCourse_attendance_logInput";
import { LectureCreateWithoutCourse_attendance_logInput } from "../inputs/LectureCreateWithoutCourse_attendance_logInput";
import { LectureWhereUniqueInput } from "../inputs/LectureWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class LectureCreateNestedOneWithoutCourse_attendance_logInput {
  @TypeGraphQL.Field(_type => LectureCreateWithoutCourse_attendance_logInput, {
    nullable: true
  })
  create?: LectureCreateWithoutCourse_attendance_logInput | undefined;

  @TypeGraphQL.Field(_type => LectureCreateOrConnectWithoutCourse_attendance_logInput, {
    nullable: true
  })
  connectOrCreate?: LectureCreateOrConnectWithoutCourse_attendance_logInput | undefined;

  @TypeGraphQL.Field(_type => LectureWhereUniqueInput, {
    nullable: true
  })
  connect?: LectureWhereUniqueInput | undefined;
}
