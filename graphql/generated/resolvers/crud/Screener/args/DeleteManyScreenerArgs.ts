import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { ScreenerWhereInput } from "../../../inputs/ScreenerWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyScreenerArgs {
  @TypeGraphQL.Field(_type => ScreenerWhereInput, {
    nullable: true
  })
  where?: ScreenerWhereInput | undefined;
}
