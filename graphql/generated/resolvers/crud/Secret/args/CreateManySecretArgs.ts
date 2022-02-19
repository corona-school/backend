import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { SecretCreateManyInput } from "../../../inputs/SecretCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManySecretArgs {
  @TypeGraphQL.Field(_type => [SecretCreateManyInput], {
    nullable: false
  })
  data!: SecretCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
