import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { MatchUpdateWithoutPupilInput } from "../inputs/MatchUpdateWithoutPupilInput";
import { MatchWhereUniqueInput } from "../inputs/MatchWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class MatchUpdateWithWhereUniqueWithoutPupilInput {
  @TypeGraphQL.Field(_type => MatchWhereUniqueInput, {
    nullable: false
  })
  where!: MatchWhereUniqueInput;

  @TypeGraphQL.Field(_type => MatchUpdateWithoutPupilInput, {
    nullable: false
  })
  data!: MatchUpdateWithoutPupilInput;
}
