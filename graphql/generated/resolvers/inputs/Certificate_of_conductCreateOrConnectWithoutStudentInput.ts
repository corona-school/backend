import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Certificate_of_conductCreateWithoutStudentInput } from "../inputs/Certificate_of_conductCreateWithoutStudentInput";
import { Certificate_of_conductWhereUniqueInput } from "../inputs/Certificate_of_conductWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Certificate_of_conductCreateOrConnectWithoutStudentInput {
  @TypeGraphQL.Field(_type => Certificate_of_conductWhereUniqueInput, {
    nullable: false
  })
  where!: Certificate_of_conductWhereUniqueInput;

  @TypeGraphQL.Field(_type => Certificate_of_conductCreateWithoutStudentInput, {
    nullable: false
  })
  create!: Certificate_of_conductCreateWithoutStudentInput;
}
