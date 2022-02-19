import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Match_pool_runOrderByInput } from "../../../inputs/Match_pool_runOrderByInput";
import { Match_pool_runWhereInput } from "../../../inputs/Match_pool_runWhereInput";
import { Match_pool_runWhereUniqueInput } from "../../../inputs/Match_pool_runWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregateMatch_pool_runArgs {
  @TypeGraphQL.Field(_type => Match_pool_runWhereInput, {
    nullable: true
  })
  where?: Match_pool_runWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Match_pool_runOrderByInput], {
    nullable: true
  })
  orderBy?: Match_pool_runOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => Match_pool_runWhereUniqueInput, {
    nullable: true
  })
  cursor?: Match_pool_runWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
