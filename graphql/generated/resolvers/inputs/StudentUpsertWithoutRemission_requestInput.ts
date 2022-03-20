import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateWithoutRemission_requestInput } from "../inputs/StudentCreateWithoutRemission_requestInput";
import { StudentUpdateWithoutRemission_requestInput } from "../inputs/StudentUpdateWithoutRemission_requestInput";

@TypeGraphQL.InputType("StudentUpsertWithoutRemission_requestInput", {
  isAbstract: true
})
export class StudentUpsertWithoutRemission_requestInput {
  @TypeGraphQL.Field(_type => StudentUpdateWithoutRemission_requestInput, {
    nullable: false
  })
  update!: StudentUpdateWithoutRemission_requestInput;

  @TypeGraphQL.Field(_type => StudentCreateWithoutRemission_requestInput, {
    nullable: false
  })
  create!: StudentCreateWithoutRemission_requestInput;
}
