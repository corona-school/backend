import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Match_pool_runUpdateManyMutationInput } from "../../../inputs/Match_pool_runUpdateManyMutationInput";
import { Match_pool_runWhereInput } from "../../../inputs/Match_pool_runWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyMatch_pool_runArgs {
  @TypeGraphQL.Field(_type => Match_pool_runUpdateManyMutationInput, {
    nullable: false
  })
  data!: Match_pool_runUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => Match_pool_runWhereInput, {
    nullable: true
  })
  where?: Match_pool_runWhereInput | undefined;
}
