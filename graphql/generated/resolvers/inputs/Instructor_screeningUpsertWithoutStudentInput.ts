import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Instructor_screeningCreateWithoutStudentInput } from "../inputs/Instructor_screeningCreateWithoutStudentInput";
import { Instructor_screeningUpdateWithoutStudentInput } from "../inputs/Instructor_screeningUpdateWithoutStudentInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Instructor_screeningUpsertWithoutStudentInput {
  @TypeGraphQL.Field(_type => Instructor_screeningUpdateWithoutStudentInput, {
    nullable: false
  })
  update!: Instructor_screeningUpdateWithoutStudentInput;

  @TypeGraphQL.Field(_type => Instructor_screeningCreateWithoutStudentInput, {
    nullable: false
  })
  create!: Instructor_screeningCreateWithoutStudentInput;
}
