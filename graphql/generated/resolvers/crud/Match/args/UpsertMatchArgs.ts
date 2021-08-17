import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { MatchCreateInput } from "../../../inputs/MatchCreateInput";
import { MatchUpdateInput } from "../../../inputs/MatchUpdateInput";
import { MatchWhereUniqueInput } from "../../../inputs/MatchWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertMatchArgs {
  @TypeGraphQL.Field(_type => MatchWhereUniqueInput, {
    nullable: false
  })
  where!: MatchWhereUniqueInput;

  @TypeGraphQL.Field(_type => MatchCreateInput, {
    nullable: false
  })
  create!: MatchCreateInput;

  @TypeGraphQL.Field(_type => MatchUpdateInput, {
    nullable: false
  })
  update!: MatchUpdateInput;
}
