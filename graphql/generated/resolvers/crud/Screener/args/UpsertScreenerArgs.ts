import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { ScreenerCreateInput } from "../../../inputs/ScreenerCreateInput";
import { ScreenerUpdateInput } from "../../../inputs/ScreenerUpdateInput";
import { ScreenerWhereUniqueInput } from "../../../inputs/ScreenerWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertScreenerArgs {
  @TypeGraphQL.Field(_type => ScreenerWhereUniqueInput, {
    nullable: false
  })
  where!: ScreenerWhereUniqueInput;

  @TypeGraphQL.Field(_type => ScreenerCreateInput, {
    nullable: false
  })
  create!: ScreenerCreateInput;

  @TypeGraphQL.Field(_type => ScreenerUpdateInput, {
    nullable: false
  })
  update!: ScreenerUpdateInput;
}
