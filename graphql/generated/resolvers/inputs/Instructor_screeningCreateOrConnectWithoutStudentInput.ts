import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Instructor_screeningCreateWithoutStudentInput } from "../inputs/Instructor_screeningCreateWithoutStudentInput";
import { Instructor_screeningWhereUniqueInput } from "../inputs/Instructor_screeningWhereUniqueInput";

@TypeGraphQL.InputType("Instructor_screeningCreateOrConnectWithoutStudentInput", {
  isAbstract: true
})
export class Instructor_screeningCreateOrConnectWithoutStudentInput {
  @TypeGraphQL.Field(_type => Instructor_screeningWhereUniqueInput, {
    nullable: false
  })
  where!: Instructor_screeningWhereUniqueInput;

  @TypeGraphQL.Field(_type => Instructor_screeningCreateWithoutStudentInput, {
    nullable: false
  })
  create!: Instructor_screeningCreateWithoutStudentInput;
}
