import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { MatchCreateWithoutStudentInput } from "../inputs/MatchCreateWithoutStudentInput";
import { MatchUpdateWithoutStudentInput } from "../inputs/MatchUpdateWithoutStudentInput";
import { MatchWhereUniqueInput } from "../inputs/MatchWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class MatchUpsertWithWhereUniqueWithoutStudentInput {
  @TypeGraphQL.Field(_type => MatchWhereUniqueInput, {
    nullable: false
  })
  where!: MatchWhereUniqueInput;

  @TypeGraphQL.Field(_type => MatchUpdateWithoutStudentInput, {
    nullable: false
  })
  update!: MatchUpdateWithoutStudentInput;

  @TypeGraphQL.Field(_type => MatchCreateWithoutStudentInput, {
    nullable: false
  })
  create!: MatchCreateWithoutStudentInput;
}
