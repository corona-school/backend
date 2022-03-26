import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { StudentOrderByWithRelationInput } from "../../../inputs/StudentOrderByWithRelationInput";
import { StudentWhereInput } from "../../../inputs/StudentWhereInput";
import { StudentWhereUniqueInput } from "../../../inputs/StudentWhereUniqueInput";
import { StudentScalarFieldEnum } from "../../../../enums/StudentScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class FindFirstStudentArgs {
  @TypeGraphQL.Field(_type => StudentWhereInput, {
    nullable: true
  })
  where?: StudentWhereInput | undefined;

  @TypeGraphQL.Field(_type => [StudentOrderByWithRelationInput], {
    nullable: true
  })
  orderBy?: StudentOrderByWithRelationInput[] | undefined;

  @TypeGraphQL.Field(_type => StudentWhereUniqueInput, {
    nullable: true
  })
  cursor?: StudentWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;

  @TypeGraphQL.Field(_type => [StudentScalarFieldEnum], {
    nullable: true
  })
  distinct?: Array<"id" | "createdAt" | "updatedAt" | "firstname" | "lastname" | "active" | "email" | "verification" | "verifiedAt" | "authToken" | "authTokenUsed" | "authTokenSent" | "wix_id" | "wix_creation_date" | "phone" | "feedback" | "newsletter" | "isStudent" | "subjects" | "openMatchRequestCount" | "isCodu" | "isInstructor" | "msg" | "state" | "university" | "module" | "moduleHours" | "isProjectCoach" | "wasJufoParticipant" | "hasJufoCertificate" | "jufoPastParticipationInfo" | "jufoPastParticipationConfirmed" | "isUniversityStudent" | "openProjectMatchRequestCount" | "sentJufoAlumniScreeningReminderCount" | "lastSentJufoAlumniScreeningInvitationDate" | "supportsInDaZ" | "languages" | "sentScreeningReminderCount" | "lastSentScreeningInvitationDate" | "sentInstructorScreeningReminderCount" | "lastSentInstructorScreeningInvitationDate" | "lastUpdatedSettingsViaBlocker" | "registrationSource"> | undefined;
}
