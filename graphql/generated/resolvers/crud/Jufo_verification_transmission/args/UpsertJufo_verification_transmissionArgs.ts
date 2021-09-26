import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Jufo_verification_transmissionCreateInput } from "../../../inputs/Jufo_verification_transmissionCreateInput";
import { Jufo_verification_transmissionUpdateInput } from "../../../inputs/Jufo_verification_transmissionUpdateInput";
import { Jufo_verification_transmissionWhereUniqueInput } from "../../../inputs/Jufo_verification_transmissionWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertJufo_verification_transmissionArgs {
  @TypeGraphQL.Field(_type => Jufo_verification_transmissionWhereUniqueInput, {
    nullable: false
  })
  where!: Jufo_verification_transmissionWhereUniqueInput;

  @TypeGraphQL.Field(_type => Jufo_verification_transmissionCreateInput, {
    nullable: false
  })
  create!: Jufo_verification_transmissionCreateInput;

  @TypeGraphQL.Field(_type => Jufo_verification_transmissionUpdateInput, {
    nullable: false
  })
  update!: Jufo_verification_transmissionUpdateInput;
}
