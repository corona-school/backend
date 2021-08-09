import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateNestedOneWithoutCourse_instructors_studentInput } from "../inputs/StudentCreateNestedOneWithoutCourse_instructors_studentInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Course_instructors_studentCreateWithoutCourseInput {
  @TypeGraphQL.Field(_type => StudentCreateNestedOneWithoutCourse_instructors_studentInput, {
    nullable: false
  })
  student!: StudentCreateNestedOneWithoutCourse_instructors_studentInput;
}
