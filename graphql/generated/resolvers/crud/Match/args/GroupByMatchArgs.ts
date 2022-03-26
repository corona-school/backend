import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { MatchOrderByWithAggregationInput } from "../../../inputs/MatchOrderByWithAggregationInput";
import { MatchScalarWhereWithAggregatesInput } from "../../../inputs/MatchScalarWhereWithAggregatesInput";
import { MatchWhereInput } from "../../../inputs/MatchWhereInput";
import { MatchScalarFieldEnum } from "../../../../enums/MatchScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByMatchArgs {
  @TypeGraphQL.Field(_type => MatchWhereInput, {
    nullable: true
  })
  where?: MatchWhereInput | undefined;

  @TypeGraphQL.Field(_type => [MatchOrderByWithAggregationInput], {
    nullable: true
  })
  orderBy?: MatchOrderByWithAggregationInput[] | undefined;

  @TypeGraphQL.Field(_type => [MatchScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "uuid" | "dissolved" | "dissolveReason" | "proposedTime" | "createdAt" | "updatedAt" | "feedbackToPupilMail" | "feedbackToStudentMail" | "followUpToPupilMail" | "followUpToStudentMail" | "source" | "studentId" | "pupilId">;

  @TypeGraphQL.Field(_type => MatchScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: MatchScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
