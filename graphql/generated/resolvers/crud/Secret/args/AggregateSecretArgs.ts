import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { SecretOrderByWithRelationInput } from "../../../inputs/SecretOrderByWithRelationInput";
import { SecretWhereInput } from "../../../inputs/SecretWhereInput";
import { SecretWhereUniqueInput } from "../../../inputs/SecretWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregateSecretArgs {
  @TypeGraphQL.Field(_type => SecretWhereInput, {
    nullable: true
  })
  where?: SecretWhereInput | undefined;

  @TypeGraphQL.Field(_type => [SecretOrderByWithRelationInput], {
    nullable: true
  })
  orderBy?: SecretOrderByWithRelationInput[] | undefined;

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
}
