import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Match_pool_runWhereUniqueInput } from "../../../inputs/Match_pool_runWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class DeleteMatch_pool_runArgs {
  @TypeGraphQL.Field(_type => Match_pool_runWhereUniqueInput, {
    nullable: false
  })
  where!: Match_pool_runWhereUniqueInput;
}
