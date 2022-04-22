import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Course_instructors_studentScalarWhereInput } from "../inputs/Course_instructors_studentScalarWhereInput";
import { Course_instructors_studentUpdateManyMutationInput } from "../inputs/Course_instructors_studentUpdateManyMutationInput";

@TypeGraphQL.InputType("Course_instructors_studentUpdateManyWithWhereWithoutCourseInput", {
  isAbstract: true
})
export class Course_instructors_studentUpdateManyWithWhereWithoutCourseInput {
  @TypeGraphQL.Field(_type => Course_instructors_studentScalarWhereInput, {
    nullable: false
  })
  where!: Course_instructors_studentScalarWhereInput;

  @TypeGraphQL.Field(_type => Course_instructors_studentUpdateManyMutationInput, {
    nullable: false
  })
  data!: Course_instructors_studentUpdateManyMutationInput;
}
