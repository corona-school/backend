import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { SecretOrderByInput } from "../../../inputs/SecretOrderByInput";
import { SecretWhereInput } from "../../../inputs/SecretWhereInput";
import { SecretWhereUniqueInput } from "../../../inputs/SecretWhereUniqueInput";
import { SecretScalarFieldEnum } from "../../../../enums/SecretScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class FindFirstSecretArgs {
  @TypeGraphQL.Field(_type => SecretWhereInput, {
    nullable: true
  })
  where?: SecretWhereInput | undefined;

  @TypeGraphQL.Field(_type => [SecretOrderByInput], {
    nullable: true
  })
  orderBy?: SecretOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => SecretWhereUniqueInput, {
    nullable: true
  })
  cursor?: SecretWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;

  @TypeGraphQL.Field(_type => [SecretScalarFieldEnum], {
    nullable: true
  })
  distinct?: Array<"id" | "createdAt" | "userId" | "type" | "secret" | "expiresAt" | "lastUsed"> | undefined;
}
