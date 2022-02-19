import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { SecretUpdateInput } from "../../../inputs/SecretUpdateInput";
import { SecretWhereUniqueInput } from "../../../inputs/SecretWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdateSecretArgs {
  @TypeGraphQL.Field(_type => SecretUpdateInput, {
    nullable: false
  })
  data!: SecretUpdateInput;

  @TypeGraphQL.Field(_type => SecretWhereUniqueInput, {
    nullable: false
  })
  where!: SecretWhereUniqueInput;
}
