import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Certificate_of_conductUpdateManyMutationInput } from "../../../inputs/Certificate_of_conductUpdateManyMutationInput";
import { Certificate_of_conductWhereInput } from "../../../inputs/Certificate_of_conductWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyCertificate_of_conductArgs {
  @TypeGraphQL.Field(_type => Certificate_of_conductUpdateManyMutationInput, {
    nullable: false
  })
  data!: Certificate_of_conductUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => Certificate_of_conductWhereInput, {
    nullable: true
  })
  where?: Certificate_of_conductWhereInput | undefined;
}
