import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_attendance_logCreateNestedManyWithoutLectureInput } from "../inputs/Course_attendance_logCreateNestedManyWithoutLectureInput";
import { SubcourseCreateNestedOneWithoutLectureInput } from "../inputs/SubcourseCreateNestedOneWithoutLectureInput";

@TypeGraphQL.InputType("LectureCreateWithoutStudentInput", {
  isAbstract: true
})
export class LectureCreateWithoutStudentInput {
  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  createdAt?: Date | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  updatedAt?: Date | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: false
  })
  start!: Date;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  duration!: number;

  @TypeGraphQL.Field(_type => SubcourseCreateNestedOneWithoutLectureInput, {
    nullable: true
  })
  subcourse?: SubcourseCreateNestedOneWithoutLectureInput | undefined;

  @TypeGraphQL.Field(_type => Course_attendance_logCreateNestedManyWithoutLectureInput, {
    nullable: true
  })
  course_attendance_log?: Course_attendance_logCreateNestedManyWithoutLectureInput | undefined;
}
