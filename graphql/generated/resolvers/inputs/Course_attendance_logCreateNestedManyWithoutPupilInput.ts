import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_attendance_logCreateManyPupilInputEnvelope } from "../inputs/Course_attendance_logCreateManyPupilInputEnvelope";
import { Course_attendance_logCreateOrConnectWithoutPupilInput } from "../inputs/Course_attendance_logCreateOrConnectWithoutPupilInput";
import { Course_attendance_logCreateWithoutPupilInput } from "../inputs/Course_attendance_logCreateWithoutPupilInput";
import { Course_attendance_logWhereUniqueInput } from "../inputs/Course_attendance_logWhereUniqueInput";

@TypeGraphQL.InputType("Course_attendance_logCreateNestedManyWithoutPupilInput", {
  isAbstract: true
})
export class Course_attendance_logCreateNestedManyWithoutPupilInput {
  @TypeGraphQL.Field(_type => [Course_attendance_logCreateWithoutPupilInput], {
    nullable: true
  })
  create?: Course_attendance_logCreateWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_attendance_logCreateOrConnectWithoutPupilInput], {
    nullable: true
  })
  connectOrCreate?: Course_attendance_logCreateOrConnectWithoutPupilInput[] | undefined;

  @TypeGraphQL.Field(_type => Course_attendance_logCreateManyPupilInputEnvelope, {
    nullable: true
  })
  createMany?: Course_attendance_logCreateManyPupilInputEnvelope | undefined;

  @TypeGraphQL.Field(_type => [Course_attendance_logWhereUniqueInput], {
    nullable: true
  })
  connect?: Course_attendance_logWhereUniqueInput[] | undefined;
}
