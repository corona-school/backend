import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { SecretCreateInput } from "../../../inputs/SecretCreateInput";

@TypeGraphQL.ArgsType()
export class CreateSecretArgs {
  @TypeGraphQL.Field(_type => SecretCreateInput, {
    nullable: false
  })
  data!: SecretCreateInput;
}
