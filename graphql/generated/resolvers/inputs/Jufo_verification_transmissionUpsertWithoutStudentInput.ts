import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Jufo_verification_transmissionCreateWithoutStudentInput } from "../inputs/Jufo_verification_transmissionCreateWithoutStudentInput";
import { Jufo_verification_transmissionUpdateWithoutStudentInput } from "../inputs/Jufo_verification_transmissionUpdateWithoutStudentInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Jufo_verification_transmissionUpsertWithoutStudentInput {
  @TypeGraphQL.Field(_type => Jufo_verification_transmissionUpdateWithoutStudentInput, {
    nullable: false
  })
  update!: Jufo_verification_transmissionUpdateWithoutStudentInput;

  @TypeGraphQL.Field(_type => Jufo_verification_transmissionCreateWithoutStudentInput, {
    nullable: false
  })
  create!: Jufo_verification_transmissionCreateWithoutStudentInput;
}
