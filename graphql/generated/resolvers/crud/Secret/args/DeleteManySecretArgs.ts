import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { SecretWhereInput } from "../../../inputs/SecretWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManySecretArgs {
  @TypeGraphQL.Field(_type => SecretWhereInput, {
    nullable: true
  })
  where?: SecretWhereInput | undefined;
}
