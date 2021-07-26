import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { ScreenerOrderByInput } from "../../../inputs/ScreenerOrderByInput";
import { ScreenerScalarWhereWithAggregatesInput } from "../../../inputs/ScreenerScalarWhereWithAggregatesInput";
import { ScreenerWhereInput } from "../../../inputs/ScreenerWhereInput";
import { ScreenerScalarFieldEnum } from "../../../../enums/ScreenerScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByScreenerArgs {
  @TypeGraphQL.Field(_type => ScreenerWhereInput, {
    nullable: true
  })
  where?: ScreenerWhereInput | undefined;

  @TypeGraphQL.Field(_type => [ScreenerOrderByInput], {
    nullable: true
  })
  orderBy?: ScreenerOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => [ScreenerScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "createdAt" | "updatedAt" | "firstname" | "lastname" | "active" | "email" | "verification" | "password" | "verified" | "oldNumberID" | "verifiedAt" | "authToken" | "authTokenUsed" | "authTokenSent">;

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
