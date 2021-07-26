import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseUpdateOneRequiredWithoutCourse_instructors_studentInput } from "../inputs/CourseUpdateOneRequiredWithoutCourse_instructors_studentInput";
import { StudentUpdateOneRequiredWithoutCourse_instructors_studentInput } from "../inputs/StudentUpdateOneRequiredWithoutCourse_instructors_studentInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_instructors_studentUpdateInput {
  @TypeGraphQL.Field(_type => CourseUpdateOneRequiredWithoutCourse_instructors_studentInput, {
    nullable: true
  })
  course?: CourseUpdateOneRequiredWithoutCourse_instructors_studentInput | undefined;

  @TypeGraphQL.Field(_type => StudentUpdateOneRequiredWithoutCourse_instructors_studentInput, {
    nullable: true
  })
  student?: StudentUpdateOneRequiredWithoutCourse_instructors_studentInput | undefined;
}
