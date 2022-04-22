import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { MatchScalarWhereInput } from "../inputs/MatchScalarWhereInput";
import { MatchUpdateManyMutationInput } from "../inputs/MatchUpdateManyMutationInput";

@TypeGraphQL.InputType("MatchUpdateManyWithWhereWithoutPupilInput", {
  isAbstract: true
})
export class MatchUpdateManyWithWhereWithoutPupilInput {
  @TypeGraphQL.Field(_type => MatchScalarWhereInput, {
    nullable: false
  })
  where!: MatchScalarWhereInput;

  @TypeGraphQL.Field(_type => MatchUpdateManyMutationInput, {
    nullable: false
  })
  data!: MatchUpdateManyMutationInput;
}
