import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { StudentOrderByInput } from "../../../inputs/StudentOrderByInput";
import { StudentWhereInput } from "../../../inputs/StudentWhereInput";
import { StudentWhereUniqueInput } from "../../../inputs/StudentWhereUniqueInput";
import { StudentScalarFieldEnum } from "../../../../enums/StudentScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class FindManyStudentArgs {
  @TypeGraphQL.Field(_type => StudentWhereInput, {
    nullable: true
  })
  where?: StudentWhereInput | undefined;

  @TypeGraphQL.Field(_type => [StudentOrderByInput], {
    nullable: true
  })
  orderBy?: StudentOrderByInput[] | undefined;

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
  distinct?: Array<"id" | "createdAt" | "updatedAt" | "firstname" | "lastname" | "active" | "email" | "verification" | "wix_id" | "wix_creation_date" | "subjects" | "msg" | "phone" | "verifiedAt" | "authToken" | "openMatchRequestCount" | "feedback" | "authTokenUsed" | "authTokenSent" | "sentScreeningReminderCount" | "lastSentScreeningInvitationDate" | "isStudent" | "isInstructor" | "newsletter" | "state" | "university" | "module" | "moduleHours" | "sentInstructorScreeningReminderCount" | "lastSentInstructorScreeningInvitationDate" | "lastUpdatedSettingsViaBlocker" | "isProjectCoach" | "wasJufoParticipant" | "hasJufoCertificate" | "jufoPastParticipationInfo" | "jufoPastParticipationConfirmed" | "isUniversityStudent" | "openProjectMatchRequestCount" | "sentJufoAlumniScreeningReminderCount" | "lastSentJufoAlumniScreeningInvitationDate" | "registrationSource" | "supportsInDaZ" | "languages"> | undefined;
}
