import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Jufo_verification_transmissionUpdateManyMutationInput } from "../../../inputs/Jufo_verification_transmissionUpdateManyMutationInput";
import { Jufo_verification_transmissionWhereInput } from "../../../inputs/Jufo_verification_transmissionWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyJufo_verification_transmissionArgs {
  @TypeGraphQL.Field(_type => Jufo_verification_transmissionUpdateManyMutationInput, {
    nullable: false
  })
  data!: Jufo_verification_transmissionUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => Jufo_verification_transmissionWhereInput, {
    nullable: true
  })
  where?: Jufo_verification_transmissionWhereInput | undefined;
}
