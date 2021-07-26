import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateWithoutJufo_verification_transmissionInput } from "../inputs/StudentCreateWithoutJufo_verification_transmissionInput";
import { StudentUpdateWithoutJufo_verification_transmissionInput } from "../inputs/StudentUpdateWithoutJufo_verification_transmissionInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class StudentUpsertWithoutJufo_verification_transmissionInput {
  @TypeGraphQL.Field(_type => StudentUpdateWithoutJufo_verification_transmissionInput, {
    nullable: false
  })
  update!: StudentUpdateWithoutJufo_verification_transmissionInput;

  @TypeGraphQL.Field(_type => StudentCreateWithoutJufo_verification_transmissionInput, {
    nullable: false
  })
  create!: StudentCreateWithoutJufo_verification_transmissionInput;
}
