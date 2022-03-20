import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Project_matchOrderByWithAggregationInput } from "../../../inputs/Project_matchOrderByWithAggregationInput";
import { Project_matchScalarWhereWithAggregatesInput } from "../../../inputs/Project_matchScalarWhereWithAggregatesInput";
import { Project_matchWhereInput } from "../../../inputs/Project_matchWhereInput";
import { Project_matchScalarFieldEnum } from "../../../../enums/Project_matchScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByProject_matchArgs {
  @TypeGraphQL.Field(_type => Project_matchWhereInput, {
    nullable: true
  })
  where?: Project_matchWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Project_matchOrderByWithAggregationInput], {
    nullable: true
  })
  orderBy?: Project_matchOrderByWithAggregationInput[] | undefined;

  @TypeGraphQL.Field(_type => [Project_matchScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "uuid" | "createdAt" | "updatedAt" | "dissolved" | "dissolveReason" | "studentId" | "pupilId">;

  @TypeGraphQL.Field(_type => Project_matchScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: Project_matchScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
