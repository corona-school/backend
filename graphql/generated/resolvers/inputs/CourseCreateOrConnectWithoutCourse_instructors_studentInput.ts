import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { CourseCreateWithoutCourse_instructors_studentInput } from "../inputs/CourseCreateWithoutCourse_instructors_studentInput";
import { CourseWhereUniqueInput } from "../inputs/CourseWhereUniqueInput";

@TypeGraphQL.InputType("CourseCreateOrConnectWithoutCourse_instructors_studentInput", {
  isAbstract: true
})
export class CourseCreateOrConnectWithoutCourse_instructors_studentInput {
  @TypeGraphQL.Field(_type => CourseWhereUniqueInput, {
    nullable: false
  })
  where!: CourseWhereUniqueInput;

  @TypeGraphQL.Field(_type => CourseCreateWithoutCourse_instructors_studentInput, {
    nullable: false
  })
  create!: CourseCreateWithoutCourse_instructors_studentInput;
}
