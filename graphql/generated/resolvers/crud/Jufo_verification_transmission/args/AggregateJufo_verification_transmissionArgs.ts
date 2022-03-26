import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Jufo_verification_transmissionOrderByWithRelationInput } from "../../../inputs/Jufo_verification_transmissionOrderByWithRelationInput";
import { Jufo_verification_transmissionWhereInput } from "../../../inputs/Jufo_verification_transmissionWhereInput";
import { Jufo_verification_transmissionWhereUniqueInput } from "../../../inputs/Jufo_verification_transmissionWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class AggregateJufo_verification_transmissionArgs {
  @TypeGraphQL.Field(_type => Jufo_verification_transmissionWhereInput, {
    nullable: true
  })
  where?: Jufo_verification_transmissionWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Jufo_verification_transmissionOrderByWithRelationInput], {
    nullable: true
  })
  orderBy?: Jufo_verification_transmissionOrderByWithRelationInput[] | undefined;

  @TypeGraphQL.Field(_type => Jufo_verification_transmissionWhereUniqueInput, {
    nullable: true
  })
  cursor?: Jufo_verification_transmissionWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
