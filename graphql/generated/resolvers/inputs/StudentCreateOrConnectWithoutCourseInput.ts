import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateWithoutCourseInput } from "../inputs/StudentCreateWithoutCourseInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType("StudentCreateOrConnectWithoutCourseInput", {
  isAbstract: true
})
export class StudentCreateOrConnectWithoutCourseInput {
  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: false
  })
  where!: StudentWhereUniqueInput;

  @TypeGraphQL.Field(_type => StudentCreateWithoutCourseInput, {
    nullable: false
  })
  create!: StudentCreateWithoutCourseInput;
}
