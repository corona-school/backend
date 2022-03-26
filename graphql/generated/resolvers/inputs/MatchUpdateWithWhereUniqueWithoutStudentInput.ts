import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { MatchUpdateWithoutStudentInput } from "../inputs/MatchUpdateWithoutStudentInput";
import { MatchWhereUniqueInput } from "../inputs/MatchWhereUniqueInput";

@TypeGraphQL.InputType("MatchUpdateWithWhereUniqueWithoutStudentInput", {
  isAbstract: true
})
export class MatchUpdateWithWhereUniqueWithoutStudentInput {
  @TypeGraphQL.Field(_type => MatchWhereUniqueInput, {
    nullable: false
  })
  where!: MatchWhereUniqueInput;

  @TypeGraphQL.Field(_type => MatchUpdateWithoutStudentInput, {
    nullable: false
  })
  data!: MatchUpdateWithoutStudentInput;
}
