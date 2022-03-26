import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateWithoutInstructor_screeningInput } from "../inputs/StudentCreateWithoutInstructor_screeningInput";
import { StudentUpdateWithoutInstructor_screeningInput } from "../inputs/StudentUpdateWithoutInstructor_screeningInput";

@TypeGraphQL.InputType("StudentUpsertWithoutInstructor_screeningInput", {
  isAbstract: true
})
export class StudentUpsertWithoutInstructor_screeningInput {
  @TypeGraphQL.Field(_type => StudentUpdateWithoutInstructor_screeningInput, {
    nullable: false
  })
  update!: StudentUpdateWithoutInstructor_screeningInput;

  @TypeGraphQL.Field(_type => StudentCreateWithoutInstructor_screeningInput, {
    nullable: false
  })
  create!: StudentCreateWithoutInstructor_screeningInput;
}
