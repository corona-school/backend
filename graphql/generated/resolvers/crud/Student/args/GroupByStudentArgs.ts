import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { StudentOrderByInput } from "../../../inputs/StudentOrderByInput";
import { StudentScalarWhereWithAggregatesInput } from "../../../inputs/StudentScalarWhereWithAggregatesInput";
import { StudentWhereInput } from "../../../inputs/StudentWhereInput";
import { StudentScalarFieldEnum } from "../../../../enums/StudentScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByStudentArgs {
  @TypeGraphQL.Field(_type => StudentWhereInput, {
    nullable: true
  })
  where?: StudentWhereInput | undefined;

  @TypeGraphQL.Field(_type => [StudentOrderByInput], {
    nullable: true
  })
  orderBy?: StudentOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => [StudentScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "createdAt" | "updatedAt" | "firstname" | "lastname" | "active" | "email" | "verification" | "wix_id" | "wix_creation_date" | "subjects" | "msg" | "phone" | "verifiedAt" | "authToken" | "openMatchRequestCount" | "feedback" | "authTokenUsed" | "authTokenSent" | "sentScreeningReminderCount" | "lastSentScreeningInvitationDate" | "isStudent" | "isInstructor" | "newsletter" | "state" | "university" | "module" | "moduleHours" | "sentInstructorScreeningReminderCount" | "lastSentInstructorScreeningInvitationDate" | "lastUpdatedSettingsViaBlocker" | "isProjectCoach" | "wasJufoParticipant" | "hasJufoCertificate" | "jufoPastParticipationInfo" | "jufoPastParticipationConfirmed" | "isUniversityStudent" | "openProjectMatchRequestCount" | "sentJufoAlumniScreeningReminderCount" | "lastSentJufoAlumniScreeningInvitationDate" | "registrationSource" | "supportsInDaZ" | "languages">;

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
