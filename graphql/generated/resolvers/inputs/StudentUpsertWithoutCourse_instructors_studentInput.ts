import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateWithoutCourse_instructors_studentInput } from "../inputs/StudentCreateWithoutCourse_instructors_studentInput";
import { StudentUpdateWithoutCourse_instructors_studentInput } from "../inputs/StudentUpdateWithoutCourse_instructors_studentInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class StudentUpsertWithoutCourse_instructors_studentInput {
  @TypeGraphQL.Field(_type => StudentUpdateWithoutCourse_instructors_studentInput, {
    nullable: false
  })
  update!: StudentUpdateWithoutCourse_instructors_studentInput;

  @TypeGraphQL.Field(_type => StudentCreateWithoutCourse_instructors_studentInput, {
    nullable: false
  })
  create!: StudentCreateWithoutCourse_instructors_studentInput;
}
