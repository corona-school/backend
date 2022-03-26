import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Expert_dataOrderByWithAggregationInput } from "../../../inputs/Expert_dataOrderByWithAggregationInput";
import { Expert_dataScalarWhereWithAggregatesInput } from "../../../inputs/Expert_dataScalarWhereWithAggregatesInput";
import { Expert_dataWhereInput } from "../../../inputs/Expert_dataWhereInput";
import { Expert_dataScalarFieldEnum } from "../../../../enums/Expert_dataScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByExpert_dataArgs {
  @TypeGraphQL.Field(_type => Expert_dataWhereInput, {
    nullable: true
  })
  where?: Expert_dataWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Expert_dataOrderByWithAggregationInput], {
    nullable: true
  })
  orderBy?: Expert_dataOrderByWithAggregationInput[] | undefined;

  @TypeGraphQL.Field(_type => [Expert_dataScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "createdAt" | "updatedAt" | "contactEmail" | "description" | "active" | "allowed" | "studentId">;

  @TypeGraphQL.Field(_type => Expert_dataScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: Expert_dataScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
