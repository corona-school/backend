import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateWithoutSubcourse_instructors_studentInput } from "../inputs/StudentCreateWithoutSubcourse_instructors_studentInput";
import { StudentUpdateWithoutSubcourse_instructors_studentInput } from "../inputs/StudentUpdateWithoutSubcourse_instructors_studentInput";

@TypeGraphQL.InputType("StudentUpsertWithoutSubcourse_instructors_studentInput", {
  isAbstract: true
})
export class StudentUpsertWithoutSubcourse_instructors_studentInput {
  @TypeGraphQL.Field(_type => StudentUpdateWithoutSubcourse_instructors_studentInput, {
    nullable: false
  })
  update!: StudentUpdateWithoutSubcourse_instructors_studentInput;

  @TypeGraphQL.Field(_type => StudentCreateWithoutSubcourse_instructors_studentInput, {
    nullable: false
  })
  create!: StudentCreateWithoutSubcourse_instructors_studentInput;
}
