import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { ScreeningCreateWithoutStudentInput } from "../inputs/ScreeningCreateWithoutStudentInput";
import { ScreeningWhereUniqueInput } from "../inputs/ScreeningWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class ScreeningCreateOrConnectWithoutStudentInput {
  @TypeGraphQL.Field(_type => ScreeningWhereUniqueInput, {
    nullable: false
  })
  where!: ScreeningWhereUniqueInput;

  @TypeGraphQL.Field(_type => ScreeningCreateWithoutStudentInput, {
    nullable: false
  })
  create!: ScreeningCreateWithoutStudentInput;
}
