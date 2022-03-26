import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_instructors_studentUpdateWithoutCourseInput } from "../inputs/Course_instructors_studentUpdateWithoutCourseInput";
import { Course_instructors_studentWhereUniqueInput } from "../inputs/Course_instructors_studentWhereUniqueInput";

@TypeGraphQL.InputType("Course_instructors_studentUpdateWithWhereUniqueWithoutCourseInput", {
  isAbstract: true
})
export class Course_instructors_studentUpdateWithWhereUniqueWithoutCourseInput {
  @TypeGraphQL.Field(_type => Course_instructors_studentWhereUniqueInput, {
    nullable: false
  })
  where!: Course_instructors_studentWhereUniqueInput;

  @TypeGraphQL.Field(_type => Course_instructors_studentUpdateWithoutCourseInput, {
    nullable: false
  })
  data!: Course_instructors_studentUpdateWithoutCourseInput;
}
