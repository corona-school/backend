import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { SecretOrderByWithAggregationInput } from "../../../inputs/SecretOrderByWithAggregationInput";
import { SecretScalarWhereWithAggregatesInput } from "../../../inputs/SecretScalarWhereWithAggregatesInput";
import { SecretWhereInput } from "../../../inputs/SecretWhereInput";
import { SecretScalarFieldEnum } from "../../../../enums/SecretScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupBySecretArgs {
  @TypeGraphQL.Field(_type => SecretWhereInput, {
    nullable: true
  })
  where?: SecretWhereInput | undefined;

  @TypeGraphQL.Field(_type => [SecretOrderByWithAggregationInput], {
    nullable: true
  })
  orderBy?: SecretOrderByWithAggregationInput[] | undefined;

  @TypeGraphQL.Field(_type => [SecretScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "createdAt" | "userId" | "type" | "secret" | "expiresAt" | "lastUsed">;

  @TypeGraphQL.Field(_type => SecretScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: SecretScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
