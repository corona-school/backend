import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateWithoutProject_coaching_screeningInput } from "../inputs/StudentCreateWithoutProject_coaching_screeningInput";
import { StudentUpdateWithoutProject_coaching_screeningInput } from "../inputs/StudentUpdateWithoutProject_coaching_screeningInput";

@TypeGraphQL.InputType("StudentUpsertWithoutProject_coaching_screeningInput", {
  isAbstract: true
})
export class StudentUpsertWithoutProject_coaching_screeningInput {
  @TypeGraphQL.Field(_type => StudentUpdateWithoutProject_coaching_screeningInput, {
    nullable: false
  })
  update!: StudentUpdateWithoutProject_coaching_screeningInput;

  @TypeGraphQL.Field(_type => StudentCreateWithoutProject_coaching_screeningInput, {
    nullable: false
  })
  create!: StudentCreateWithoutProject_coaching_screeningInput;
}
