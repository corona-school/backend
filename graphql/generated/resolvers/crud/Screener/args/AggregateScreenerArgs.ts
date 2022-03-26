import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { ScreenerOrderByWithRelationInput } from "../../../inputs/ScreenerOrderByWithRelationInput";
import { ScreenerWhereInput } from "../../../inputs/ScreenerWhereInput";
import { ScreenerWhereUniqueInput } from "../../../inputs/ScreenerWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregateScreenerArgs {
  @TypeGraphQL.Field(_type => ScreenerWhereInput, {
    nullable: true
  })
  where?: ScreenerWhereInput | undefined;

  @TypeGraphQL.Field(_type => [ScreenerOrderByWithRelationInput], {
    nullable: true
  })
  orderBy?: ScreenerOrderByWithRelationInput[] | undefined;

  @TypeGraphQL.Field(_type => ScreenerWhereUniqueInput, {
    nullable: true
  })
  cursor?: ScreenerWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
