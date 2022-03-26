import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Remission_requestCreateWithoutStudentInput } from "../inputs/Remission_requestCreateWithoutStudentInput";
import { Remission_requestUpdateWithoutStudentInput } from "../inputs/Remission_requestUpdateWithoutStudentInput";

@TypeGraphQL.InputType("Remission_requestUpsertWithoutStudentInput", {
  isAbstract: true
})
export class Remission_requestUpsertWithoutStudentInput {
  @TypeGraphQL.Field(_type => Remission_requestUpdateWithoutStudentInput, {
    nullable: false
  })
  update!: Remission_requestUpdateWithoutStudentInput;

  @TypeGraphQL.Field(_type => Remission_requestCreateWithoutStudentInput, {
    nullable: false
  })
  create!: Remission_requestCreateWithoutStudentInput;
}
