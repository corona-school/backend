import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { SecretUpdateManyMutationInput } from "../../../inputs/SecretUpdateManyMutationInput";
import { SecretWhereInput } from "../../../inputs/SecretWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManySecretArgs {
  @TypeGraphQL.Field(_type => SecretUpdateManyMutationInput, {
    nullable: false
  })
  data!: SecretUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => SecretWhereInput, {
    nullable: true
  })
  where?: SecretWhereInput | undefined;
}
