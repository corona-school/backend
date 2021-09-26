import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Jufo_verification_transmissionWhereInput } from "../../../inputs/Jufo_verification_transmissionWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyJufo_verification_transmissionArgs {
  @TypeGraphQL.Field(_type => Jufo_verification_transmissionWhereInput, {
    nullable: true
  })
  where?: Jufo_verification_transmissionWhereInput | undefined;
}
