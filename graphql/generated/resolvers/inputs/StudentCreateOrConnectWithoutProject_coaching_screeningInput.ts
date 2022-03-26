import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateWithoutProject_coaching_screeningInput } from "../inputs/StudentCreateWithoutProject_coaching_screeningInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class StudentCreateOrConnectWithoutProject_coaching_screeningInput {
  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: false
  })
  where!: StudentWhereUniqueInput;

  @TypeGraphQL.Field(_type => StudentCreateWithoutProject_coaching_screeningInput, {
    nullable: false
  })
  create!: StudentCreateWithoutProject_coaching_screeningInput;
}
