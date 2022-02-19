import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Match_pool_runCreateInput } from "../../../inputs/Match_pool_runCreateInput";

@TypeGraphQL.ArgsType()
export class CreateMatch_pool_runArgs {
  @TypeGraphQL.Field(_type => Match_pool_runCreateInput, {
    nullable: false
  })
  data!: Match_pool_runCreateInput;
}
