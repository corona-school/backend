import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";

@TypeGraphQL.InputType("Course_instructors_studentCreateManyStudentInput", {
  isAbstract: true
})
export class Course_instructors_studentCreateManyStudentInput {
  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: false
  })
  courseId!: number;
}
