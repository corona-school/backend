import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Match_pool_runCreateInput } from "../../../inputs/Match_pool_runCreateInput";
import { Match_pool_runUpdateInput } from "../../../inputs/Match_pool_runUpdateInput";
import { Match_pool_runWhereUniqueInput } from "../../../inputs/Match_pool_runWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertMatch_pool_runArgs {
  @TypeGraphQL.Field(_type => Match_pool_runWhereUniqueInput, {
    nullable: false
  })
  where!: Match_pool_runWhereUniqueInput;

  @TypeGraphQL.Field(_type => Match_pool_runCreateInput, {
    nullable: false
  })
  create!: Match_pool_runCreateInput;

  @TypeGraphQL.Field(_type => Match_pool_runUpdateInput, {
    nullable: false
  })
  update!: Match_pool_runUpdateInput;
}
