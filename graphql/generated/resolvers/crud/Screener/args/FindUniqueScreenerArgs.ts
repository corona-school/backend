import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { ScreenerWhereUniqueInput } from "../../../inputs/ScreenerWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class FindUniqueScreenerArgs {
  @TypeGraphQL.Field(_type => ScreenerWhereUniqueInput, {
    nullable: false
  })
  where!: ScreenerWhereUniqueInput;
}
