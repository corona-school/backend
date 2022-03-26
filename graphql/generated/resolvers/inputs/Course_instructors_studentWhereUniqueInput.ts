import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { course_instructors_studentCourseIdStudentIdCompoundUniqueInput } from "../inputs/course_instructors_studentCourseIdStudentIdCompoundUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_instructors_studentWhereUniqueInput {
  @TypeGraphQL.Field(_type => course_instructors_studentCourseIdStudentIdCompoundUniqueInput, {
    nullable: true
  })
  courseId_studentId?: course_instructors_studentCourseIdStudentIdCompoundUniqueInput | undefined;
}
