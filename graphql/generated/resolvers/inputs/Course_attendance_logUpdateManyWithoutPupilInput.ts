import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_attendance_logCreateManyPupilInputEnvelope } from "../inputs/Course_attendance_logCreateManyPupilInputEnvelope";
import { Course_attendance_logCreateOrConnectWithoutPupilInput } from "../inputs/Course_attendance_logCreateOrConnectWithoutPupilInput";
import { Course_attendance_logCreateWithoutPupilInput } from "../inputs/Course_attendance_logCreateWithoutPupilInput";
import { Course_attendance_logScalarWhereInput } from "../inputs/Course_attendance_logScalarWhereInput";
import { Course_attendance_logUpdateManyWithWhereWithoutPupilInput } from "../inputs/Course_attendance_logUpdateManyWithWhereWithoutPupilInput";
import { Course_attendance_logUpdateWithWhereUniqueWithoutPupilInput } from "../inputs/Course_attendance_logUpdateWithWhereUniqueWithoutPupilInput";
import { Course_attendance_logUpsertWithWhereUniqueWithoutPupilInput } from "../inputs/Course_attendance_logUpsertWithWhereUniqueWithoutPupilInput";
import { Course_attendance_logWhereUniqueInput } from "../inputs/Course_attendance_logWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_attendance_logUpdateManyWithoutPupilInput {
  @TypeGraphQL.Field(_type => [Course_attendance_logCreateWithoutPupilInput], {
    nullable: true
  })
  create?: Course_attendance_logCreateWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_attendance_logCreateOrConnectWithoutPupilInput], {
    nullable: true
  })
  connectOrCreate?: Course_attendance_logCreateOrConnectWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_attendance_logUpsertWithWhereUniqueWithoutPupilInput], {
    nullable: true
  })
  upsert?: Course_attendance_logUpsertWithWhereUniqueWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => Course_attendance_logCreateManyPupilInputEnvelope, {
    nullable: true
  })
  createMany?: Course_attendance_logCreateManyPupilInputEnvelope | undefined;

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

  @TypeGraphQL.Field(_type => [Course_attendance_logUpdateWithWhereUniqueWithoutPupilInput], {
    nullable: true
  })
  update?: Course_attendance_logUpdateWithWhereUniqueWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_attendance_logUpdateManyWithWhereWithoutPupilInput], {
    nullable: true
  })
  updateMany?: Course_attendance_logUpdateManyWithWhereWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_attendance_logScalarWhereInput], {
    nullable: true
  })
  deleteMany?: Course_attendance_logScalarWhereInput[] | undefined;
}
