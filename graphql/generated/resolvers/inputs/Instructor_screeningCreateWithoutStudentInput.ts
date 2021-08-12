import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreenerCreateNestedOneWithoutInstructor_screeningInput } from "../inputs/ScreenerCreateNestedOneWithoutInstructor_screeningInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Instructor_screeningCreateWithoutStudentInput {
  @TypeGraphQL.Field(_type => Boolean, {
    nullable: false
  })
  success!: boolean;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  comment?: string | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  knowsCoronaSchoolFrom?: string | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  createdAt?: Date | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  updatedAt?: Date | undefined;

  @TypeGraphQL.Field(_type => ScreenerCreateNestedOneWithoutInstructor_screeningInput, {
    nullable: true
  })
  screener?: ScreenerCreateNestedOneWithoutInstructor_screeningInput | undefined;
}
