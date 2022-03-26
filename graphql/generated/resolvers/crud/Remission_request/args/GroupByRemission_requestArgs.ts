import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Remission_requestOrderByWithAggregationInput } from "../../../inputs/Remission_requestOrderByWithAggregationInput";
import { Remission_requestScalarWhereWithAggregatesInput } from "../../../inputs/Remission_requestScalarWhereWithAggregatesInput";
import { Remission_requestWhereInput } from "../../../inputs/Remission_requestWhereInput";
import { Remission_requestScalarFieldEnum } from "../../../../enums/Remission_requestScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByRemission_requestArgs {
  @TypeGraphQL.Field(_type => Remission_requestWhereInput, {
    nullable: true
  })
  where?: Remission_requestWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Remission_requestOrderByWithAggregationInput], {
    nullable: true
  })
  orderBy?: Remission_requestOrderByWithAggregationInput[] | undefined;

  @TypeGraphQL.Field(_type => [Remission_requestScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "createdAt" | "updatedAt" | "uuid" | "studentId">;

  @TypeGraphQL.Field(_type => Remission_requestScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: Remission_requestScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
