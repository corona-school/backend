import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { MatchUpdateInput } from "../../../inputs/MatchUpdateInput";
import { MatchWhereUniqueInput } from "../../../inputs/MatchWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateMatchArgs {
  @TypeGraphQL.Field(_type => MatchUpdateInput, {
    nullable: false
  })
  data!: MatchUpdateInput;

  @TypeGraphQL.Field(_type => MatchWhereUniqueInput, {
    nullable: false
  })
  where!: MatchWhereUniqueInput;
}
