import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { MatchCreateWithoutPupilInput } from "../inputs/MatchCreateWithoutPupilInput";
import { MatchUpdateWithoutPupilInput } from "../inputs/MatchUpdateWithoutPupilInput";
import { MatchWhereUniqueInput } from "../inputs/MatchWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class MatchUpsertWithWhereUniqueWithoutPupilInput {
  @TypeGraphQL.Field(_type => MatchWhereUniqueInput, {
    nullable: false
  })
  where!: MatchWhereUniqueInput;

  @TypeGraphQL.Field(_type => MatchUpdateWithoutPupilInput, {
    nullable: false
  })
  update!: MatchUpdateWithoutPupilInput;

  @TypeGraphQL.Field(_type => MatchCreateWithoutPupilInput, {
    nullable: false
  })
  create!: MatchCreateWithoutPupilInput;
}
