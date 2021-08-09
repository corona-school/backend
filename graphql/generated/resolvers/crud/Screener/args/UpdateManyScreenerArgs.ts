import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { ScreenerUpdateManyMutationInput } from "../../../inputs/ScreenerUpdateManyMutationInput";
import { ScreenerWhereInput } from "../../../inputs/ScreenerWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyScreenerArgs {
  @TypeGraphQL.Field(_type => ScreenerUpdateManyMutationInput, {
    nullable: false
  })
  data!: ScreenerUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => ScreenerWhereInput, {
    nullable: true
  })
  where?: ScreenerWhereInput | undefined;
}
