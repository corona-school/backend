import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseCreateNestedOneWithoutCourse_instructors_studentInput } from "../inputs/CourseCreateNestedOneWithoutCourse_instructors_studentInput";
import { StudentCreateNestedOneWithoutCourse_instructors_studentInput } from "../inputs/StudentCreateNestedOneWithoutCourse_instructors_studentInput";

@TypeGraphQL.InputType("Course_instructors_studentCreateInput", {
  isAbstract: true
})
export class Course_instructors_studentCreateInput {
  @TypeGraphQL.Field(_type => CourseCreateNestedOneWithoutCourse_instructors_studentInput, {
    nullable: false
  })
  course!: CourseCreateNestedOneWithoutCourse_instructors_studentInput;

  @TypeGraphQL.Field(_type => StudentCreateNestedOneWithoutCourse_instructors_studentInput, {
    nullable: false
  })
  student!: StudentCreateNestedOneWithoutCourse_instructors_studentInput;
}
