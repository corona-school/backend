import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Match_pool_runUpdateInput } from "../../../inputs/Match_pool_runUpdateInput";
import { Match_pool_runWhereUniqueInput } from "../../../inputs/Match_pool_runWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateMatch_pool_runArgs {
  @TypeGraphQL.Field(_type => Match_pool_runUpdateInput, {
    nullable: false
  })
  data!: Match_pool_runUpdateInput;

  @TypeGraphQL.Field(_type => Match_pool_runWhereUniqueInput, {
    nullable: false
  })
  where!: Match_pool_runWhereUniqueInput;
}
