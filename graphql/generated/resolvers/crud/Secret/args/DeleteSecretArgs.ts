import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { SecretWhereUniqueInput } from "../../../inputs/SecretWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class DeleteSecretArgs {
  @TypeGraphQL.Field(_type => SecretWhereUniqueInput, {
    nullable: false
  })
  where!: SecretWhereUniqueInput;
}
