import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Match_pool_runCreateManyInput } from "../../../inputs/Match_pool_runCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyMatch_pool_runArgs {
  @TypeGraphQL.Field(_type => [Match_pool_runCreateManyInput], {
    nullable: false
  })
  data!: Match_pool_runCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
