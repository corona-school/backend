import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Jufo_verification_transmissionCreateInput } from "../../../inputs/Jufo_verification_transmissionCreateInput";

@TypeGraphQL.ArgsType()
export class CreateJufo_verification_transmissionArgs {
  @TypeGraphQL.Field(_type => Jufo_verification_transmissionCreateInput, {
    nullable: false
  })
  data!: Jufo_verification_transmissionCreateInput;
}
