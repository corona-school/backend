import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { ScreenerCreateInput } from "../../../inputs/ScreenerCreateInput";

@TypeGraphQL.ArgsType()
export class CreateScreenerArgs {
  @TypeGraphQL.Field(_type => ScreenerCreateInput, {
    nullable: false
  })
  data!: ScreenerCreateInput;
}
