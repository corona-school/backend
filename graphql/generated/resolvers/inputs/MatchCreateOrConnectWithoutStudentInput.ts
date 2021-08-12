import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { MatchCreateWithoutStudentInput } from "../inputs/MatchCreateWithoutStudentInput";
import { MatchWhereUniqueInput } from "../inputs/MatchWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class MatchCreateOrConnectWithoutStudentInput {
  @TypeGraphQL.Field(_type => MatchWhereUniqueInput, {
    nullable: false
  })
  where!: MatchWhereUniqueInput;

  @TypeGraphQL.Field(_type => MatchCreateWithoutStudentInput, {
    nullable: false
  })
  create!: MatchCreateWithoutStudentInput;
}
