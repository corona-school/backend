import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { MatchOrderByInput } from "../../../inputs/MatchOrderByInput";
import { MatchScalarWhereWithAggregatesInput } from "../../../inputs/MatchScalarWhereWithAggregatesInput";
import { MatchWhereInput } from "../../../inputs/MatchWhereInput";
import { MatchScalarFieldEnum } from "../../../../enums/MatchScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByMatchArgs {
  @TypeGraphQL.Field(_type => MatchWhereInput, {
    nullable: true
  })
  where?: MatchWhereInput | undefined;

  @TypeGraphQL.Field(_type => [MatchOrderByInput], {
    nullable: true
  })
  orderBy?: MatchOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => [MatchScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "uuid" | "dissolved" | "proposedTime" | "createdAt" | "updatedAt" | "source" | "studentId" | "pupilId" | "dissolveReason" | "feedbackToPupilMail" | "feedbackToStudentMail" | "followUpToPupilMail" | "followUpToStudentMail">;

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
