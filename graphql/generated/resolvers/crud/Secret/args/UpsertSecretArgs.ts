import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { SecretCreateInput } from "../../../inputs/SecretCreateInput";
import { SecretUpdateInput } from "../../../inputs/SecretUpdateInput";
import { SecretWhereUniqueInput } from "../../../inputs/SecretWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertSecretArgs {
  @TypeGraphQL.Field(_type => SecretWhereUniqueInput, {
    nullable: false
  })
  where!: SecretWhereUniqueInput;

  @TypeGraphQL.Field(_type => SecretCreateInput, {
    nullable: false
  })
  create!: SecretCreateInput;

  @TypeGraphQL.Field(_type => SecretUpdateInput, {
    nullable: false
  })
  update!: SecretUpdateInput;
}
