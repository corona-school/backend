import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { ScreenerOrderByWithAggregationInput } from "../../../inputs/ScreenerOrderByWithAggregationInput";
import { ScreenerScalarWhereWithAggregatesInput } from "../../../inputs/ScreenerScalarWhereWithAggregatesInput";
import { ScreenerWhereInput } from "../../../inputs/ScreenerWhereInput";
import { ScreenerScalarFieldEnum } from "../../../../enums/ScreenerScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByScreenerArgs {
  @TypeGraphQL.Field(_type => ScreenerWhereInput, {
    nullable: true
  })
  where?: ScreenerWhereInput | undefined;

  @TypeGraphQL.Field(_type => [ScreenerOrderByWithAggregationInput], {
    nullable: true
  })
  orderBy?: ScreenerOrderByWithAggregationInput[] | undefined;

  @TypeGraphQL.Field(_type => [ScreenerScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "createdAt" | "updatedAt" | "firstname" | "lastname" | "active" | "email" | "verification" | "verifiedAt" | "authToken" | "authTokenUsed" | "authTokenSent" | "password" | "verified" | "oldNumberID">;

  @TypeGraphQL.Field(_type => ScreenerScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: ScreenerScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
