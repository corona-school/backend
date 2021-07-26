import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_attendance_logUpdateWithoutLectureInput } from "../inputs/Course_attendance_logUpdateWithoutLectureInput";
import { Course_attendance_logWhereUniqueInput } from "../inputs/Course_attendance_logWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_attendance_logUpdateWithWhereUniqueWithoutLectureInput {
  @TypeGraphQL.Field(_type => Course_attendance_logWhereUniqueInput, {
    nullable: false
  })
  where!: Course_attendance_logWhereUniqueInput;

  @TypeGraphQL.Field(_type => Course_attendance_logUpdateWithoutLectureInput, {
    nullable: false
  })
  data!: Course_attendance_logUpdateWithoutLectureInput;
}
