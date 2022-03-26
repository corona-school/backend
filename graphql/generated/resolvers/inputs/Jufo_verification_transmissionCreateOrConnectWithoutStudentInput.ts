import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Jufo_verification_transmissionCreateWithoutStudentInput } from "../inputs/Jufo_verification_transmissionCreateWithoutStudentInput";
import { Jufo_verification_transmissionWhereUniqueInput } from "../inputs/Jufo_verification_transmissionWhereUniqueInput";

@TypeGraphQL.InputType("Jufo_verification_transmissionCreateOrConnectWithoutStudentInput", {
  isAbstract: true
})
export class Jufo_verification_transmissionCreateOrConnectWithoutStudentInput {
  @TypeGraphQL.Field(_type => Jufo_verification_transmissionWhereUniqueInput, {
    nullable: false
  })
  where!: Jufo_verification_transmissionWhereUniqueInput;

  @TypeGraphQL.Field(_type => Jufo_verification_transmissionCreateWithoutStudentInput, {
    nullable: false
  })
  create!: Jufo_verification_transmissionCreateWithoutStudentInput;
}
