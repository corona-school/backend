import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_attendance_logCreateWithoutLectureInput } from "../inputs/Course_attendance_logCreateWithoutLectureInput";
import { Course_attendance_logWhereUniqueInput } from "../inputs/Course_attendance_logWhereUniqueInput";

@TypeGraphQL.InputType("Course_attendance_logCreateOrConnectWithoutLectureInput", {
  isAbstract: true
})
export class Course_attendance_logCreateOrConnectWithoutLectureInput {
  @TypeGraphQL.Field(_type => Course_attendance_logWhereUniqueInput, {
    nullable: false
  })
  where!: Course_attendance_logWhereUniqueInput;

  @TypeGraphQL.Field(_type => Course_attendance_logCreateWithoutLectureInput, {
    nullable: false
  })
  create!: Course_attendance_logCreateWithoutLectureInput;
}
