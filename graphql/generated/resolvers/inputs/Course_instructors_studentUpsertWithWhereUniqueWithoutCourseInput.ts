import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_instructors_studentCreateWithoutCourseInput } from "../inputs/Course_instructors_studentCreateWithoutCourseInput";
import { Course_instructors_studentUpdateWithoutCourseInput } from "../inputs/Course_instructors_studentUpdateWithoutCourseInput";
import { Course_instructors_studentWhereUniqueInput } from "../inputs/Course_instructors_studentWhereUniqueInput";

@TypeGraphQL.InputType("Course_instructors_studentUpsertWithWhereUniqueWithoutCourseInput", {
  isAbstract: true
})
export class Course_instructors_studentUpsertWithWhereUniqueWithoutCourseInput {
  @TypeGraphQL.Field(_type => Course_instructors_studentWhereUniqueInput, {
    nullable: false
  })
  where!: Course_instructors_studentWhereUniqueInput;

  @TypeGraphQL.Field(_type => Course_instructors_studentUpdateWithoutCourseInput, {
    nullable: false
  })
  update!: Course_instructors_studentUpdateWithoutCourseInput;

  @TypeGraphQL.Field(_type => Course_instructors_studentCreateWithoutCourseInput, {
    nullable: false
  })
  create!: Course_instructors_studentCreateWithoutCourseInput;
}
