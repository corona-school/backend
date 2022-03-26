import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentUpdateOneRequiredWithoutCourse_instructors_studentInput } from "../inputs/StudentUpdateOneRequiredWithoutCourse_instructors_studentInput";

@TypeGraphQL.InputType("Course_instructors_studentUpdateWithoutCourseInput", {
  isAbstract: true
})
export class Course_instructors_studentUpdateWithoutCourseInput {
  @TypeGraphQL.Field(_type => StudentUpdateOneRequiredWithoutCourse_instructors_studentInput, {
    nullable: true
  })
  student?: StudentUpdateOneRequiredWithoutCourse_instructors_studentInput | undefined;
}
