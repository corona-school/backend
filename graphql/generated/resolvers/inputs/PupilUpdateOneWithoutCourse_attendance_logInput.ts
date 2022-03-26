import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateOrConnectWithoutCourse_attendance_logInput } from "../inputs/PupilCreateOrConnectWithoutCourse_attendance_logInput";
import { PupilCreateWithoutCourse_attendance_logInput } from "../inputs/PupilCreateWithoutCourse_attendance_logInput";
import { PupilUpdateWithoutCourse_attendance_logInput } from "../inputs/PupilUpdateWithoutCourse_attendance_logInput";
import { PupilUpsertWithoutCourse_attendance_logInput } from "../inputs/PupilUpsertWithoutCourse_attendance_logInput";
import { PupilWhereUniqueInput } from "../inputs/PupilWhereUniqueInput";

@TypeGraphQL.InputType("PupilUpdateOneWithoutCourse_attendance_logInput", {
  isAbstract: true
})
export class PupilUpdateOneWithoutCourse_attendance_logInput {
  @TypeGraphQL.Field(_type => PupilCreateWithoutCourse_attendance_logInput, {
    nullable: true
  })
  create?: PupilCreateWithoutCourse_attendance_logInput | undefined;

  @TypeGraphQL.Field(_type => PupilCreateOrConnectWithoutCourse_attendance_logInput, {
    nullable: true
  })
  connectOrCreate?: PupilCreateOrConnectWithoutCourse_attendance_logInput | undefined;

  @TypeGraphQL.Field(_type => PupilUpsertWithoutCourse_attendance_logInput, {
    nullable: true
  })
  upsert?: PupilUpsertWithoutCourse_attendance_logInput | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  disconnect?: boolean | undefined;

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  delete?: boolean | undefined;

  @TypeGraphQL.Field(_type => PupilWhereUniqueInput, {
    nullable: true
  })
  connect?: PupilWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => PupilUpdateWithoutCourse_attendance_logInput, {
    nullable: true
  })
  update?: PupilUpdateWithoutCourse_attendance_logInput | undefined;
}
