import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Jufo_verification_transmissionOrderByWithAggregationInput } from "../../../inputs/Jufo_verification_transmissionOrderByWithAggregationInput";
import { Jufo_verification_transmissionScalarWhereWithAggregatesInput } from "../../../inputs/Jufo_verification_transmissionScalarWhereWithAggregatesInput";
import { Jufo_verification_transmissionWhereInput } from "../../../inputs/Jufo_verification_transmissionWhereInput";
import { Jufo_verification_transmissionScalarFieldEnum } from "../../../../enums/Jufo_verification_transmissionScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByJufo_verification_transmissionArgs {
  @TypeGraphQL.Field(_type => Jufo_verification_transmissionWhereInput, {
    nullable: true
  })
  where?: Jufo_verification_transmissionWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Jufo_verification_transmissionOrderByWithAggregationInput], {
    nullable: true
  })
  orderBy?: Jufo_verification_transmissionOrderByWithAggregationInput[] | undefined;

  @TypeGraphQL.Field(_type => [Jufo_verification_transmissionScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "createdAt" | "uuid" | "studentId">;

  @TypeGraphQL.Field(_type => Jufo_verification_transmissionScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: Jufo_verification_transmissionScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
