import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { ScreenerUpdateInput } from "../../../inputs/ScreenerUpdateInput";
import { ScreenerWhereUniqueInput } from "../../../inputs/ScreenerWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateScreenerArgs {
  @TypeGraphQL.Field(_type => ScreenerUpdateInput, {
    nullable: false
  })
  data!: ScreenerUpdateInput;

  @TypeGraphQL.Field(_type => ScreenerWhereUniqueInput, {
    nullable: false
  })
  where!: ScreenerWhereUniqueInput;
}
