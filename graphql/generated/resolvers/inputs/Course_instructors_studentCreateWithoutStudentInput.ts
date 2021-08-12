import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseCreateNestedOneWithoutCourse_instructors_studentInput } from "../inputs/CourseCreateNestedOneWithoutCourse_instructors_studentInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_instructors_studentCreateWithoutStudentInput {
  @TypeGraphQL.Field(_type => CourseCreateNestedOneWithoutCourse_instructors_studentInput, {
    nullable: false
  })
  course!: CourseCreateNestedOneWithoutCourse_instructors_studentInput;
}
