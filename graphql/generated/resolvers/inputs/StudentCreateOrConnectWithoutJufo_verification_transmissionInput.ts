import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { StudentCreateWithoutJufo_verification_transmissionInput } from "../inputs/StudentCreateWithoutJufo_verification_transmissionInput";
import { StudentWhereUniqueInput } from "../inputs/StudentWhereUniqueInput";

@TypeGraphQL.InputType("StudentCreateOrConnectWithoutJufo_verification_transmissionInput", {
  isAbstract: true
})
export class StudentCreateOrConnectWithoutJufo_verification_transmissionInput {
  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: false
  })
  where!: StudentWhereUniqueInput;

  @TypeGraphQL.Field(_type => StudentCreateWithoutJufo_verification_transmissionInput, {
    nullable: false
  })
  create!: StudentCreateWithoutJufo_verification_transmissionInput;
}
