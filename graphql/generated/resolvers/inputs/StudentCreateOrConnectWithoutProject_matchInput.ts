import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateWithoutProject_matchInput } from "../inputs/StudentCreateWithoutProject_matchInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType("StudentCreateOrConnectWithoutProject_matchInput", {
  isAbstract: true
})
export class StudentCreateOrConnectWithoutProject_matchInput {
  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: false
  })
  where!: StudentWhereUniqueInput;

  @TypeGraphQL.Field(_type => StudentCreateWithoutProject_matchInput, {
    nullable: false
  })
  create!: StudentCreateWithoutProject_matchInput;
}
