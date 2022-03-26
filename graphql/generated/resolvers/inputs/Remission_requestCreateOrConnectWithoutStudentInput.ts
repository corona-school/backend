import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Remission_requestCreateWithoutStudentInput } from "../inputs/Remission_requestCreateWithoutStudentInput";
import { Remission_requestWhereUniqueInput } from "../inputs/Remission_requestWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Remission_requestCreateOrConnectWithoutStudentInput {
  @TypeGraphQL.Field(_type => Remission_requestWhereUniqueInput, {
    nullable: false
  })
  where!: Remission_requestWhereUniqueInput;

  @TypeGraphQL.Field(_type => Remission_requestCreateWithoutStudentInput, {
    nullable: false
  })
  create!: Remission_requestCreateWithoutStudentInput;
}
