import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { StudentOrderByWithAggregationInput } from "../../../inputs/StudentOrderByWithAggregationInput";
import { StudentScalarWhereWithAggregatesInput } from "../../../inputs/StudentScalarWhereWithAggregatesInput";
import { StudentWhereInput } from "../../../inputs/StudentWhereInput";
import { StudentScalarFieldEnum } from "../../../../enums/StudentScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByStudentArgs {
  @TypeGraphQL.Field(_type => StudentWhereInput, {
    nullable: true
  })
  where?: StudentWhereInput | undefined;

  @TypeGraphQL.Field(_type => [StudentOrderByWithAggregationInput], {
    nullable: true
  })
  orderBy?: StudentOrderByWithAggregationInput[] | undefined;

  @TypeGraphQL.Field(_type => [StudentScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "createdAt" | "updatedAt" | "firstname" | "lastname" | "active" | "email" | "verification" | "verifiedAt" | "authToken" | "authTokenUsed" | "authTokenSent" | "wix_id" | "wix_creation_date" | "phone" | "feedback" | "newsletter" | "isStudent" | "subjects" | "openMatchRequestCount" | "isCodu" | "isInstructor" | "msg" | "state" | "university" | "module" | "moduleHours" | "isProjectCoach" | "wasJufoParticipant" | "hasJufoCertificate" | "jufoPastParticipationInfo" | "jufoPastParticipationConfirmed" | "isUniversityStudent" | "openProjectMatchRequestCount" | "sentJufoAlumniScreeningReminderCount" | "lastSentJufoAlumniScreeningInvitationDate" | "supportsInDaZ" | "languages" | "sentScreeningReminderCount" | "lastSentScreeningInvitationDate" | "sentInstructorScreeningReminderCount" | "lastSentInstructorScreeningInvitationDate" | "lastUpdatedSettingsViaBlocker" | "registrationSource">;

  @TypeGraphQL.Field(_type => StudentScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: StudentScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
