import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Jufo_verification_transmissionWhereUniqueInput } from "../../../inputs/Jufo_verification_transmissionWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class FindUniqueJufo_verification_transmissionArgs {
  @TypeGraphQL.Field(_type => Jufo_verification_transmissionWhereUniqueInput, {
    nullable: false
  })
  where!: Jufo_verification_transmissionWhereUniqueInput;
}
