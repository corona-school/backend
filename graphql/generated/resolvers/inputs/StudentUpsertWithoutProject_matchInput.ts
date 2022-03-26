import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateWithoutProject_matchInput } from "../inputs/StudentCreateWithoutProject_matchInput";
import { StudentUpdateWithoutProject_matchInput } from "../inputs/StudentUpdateWithoutProject_matchInput";

@TypeGraphQL.InputType("StudentUpsertWithoutProject_matchInput", {
  isAbstract: true
})
export class StudentUpsertWithoutProject_matchInput {
  @TypeGraphQL.Field(_type => StudentUpdateWithoutProject_matchInput, {
    nullable: false
  })
  update!: StudentUpdateWithoutProject_matchInput;

  @TypeGraphQL.Field(_type => StudentCreateWithoutProject_matchInput, {
    nullable: false
  })
  create!: StudentCreateWithoutProject_matchInput;
}
