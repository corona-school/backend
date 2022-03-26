import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateWithoutInstructor_screeningInput } from "../inputs/StudentCreateWithoutInstructor_screeningInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType("StudentCreateOrConnectWithoutInstructor_screeningInput", {
  isAbstract: true
})
export class StudentCreateOrConnectWithoutInstructor_screeningInput {
  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: false
  })
  where!: StudentWhereUniqueInput;

  @TypeGraphQL.Field(_type => StudentCreateWithoutInstructor_screeningInput, {
    nullable: false
  })
  create!: StudentCreateWithoutInstructor_screeningInput;
}
