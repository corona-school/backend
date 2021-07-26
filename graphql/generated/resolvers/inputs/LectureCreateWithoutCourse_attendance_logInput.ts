import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateNestedOneWithoutLectureInput } from "../inputs/StudentCreateNestedOneWithoutLectureInput";
import { SubcourseCreateNestedOneWithoutLectureInput } from "../inputs/SubcourseCreateNestedOneWithoutLectureInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class LectureCreateWithoutCourse_attendance_logInput {
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

  @TypeGraphQL.Field(_type => StudentCreateNestedOneWithoutLectureInput, {
    nullable: true
  })
  student?: StudentCreateNestedOneWithoutLectureInput | undefined;

  @TypeGraphQL.Field(_type => SubcourseCreateNestedOneWithoutLectureInput, {
    nullable: true
  })
  subcourse?: SubcourseCreateNestedOneWithoutLectureInput | undefined;
}
