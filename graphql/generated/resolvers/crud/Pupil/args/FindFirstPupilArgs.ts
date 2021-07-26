import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { PupilOrderByInput } from "../../../inputs/PupilOrderByInput";
import { PupilWhereInput } from "../../../inputs/PupilWhereInput";
import { PupilWhereUniqueInput } from "../../../inputs/PupilWhereUniqueInput";
import { PupilScalarFieldEnum } from "../../../../enums/PupilScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class FindFirstPupilArgs {
  @TypeGraphQL.Field(_type => PupilWhereInput, {
    nullable: true
  })
  where?: PupilWhereInput | undefined;

  @TypeGraphQL.Field(_type => [PupilOrderByInput], {
    nullable: true
  })
  orderBy?: PupilOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => PupilWhereUniqueInput, {
    nullable: true
  })
  cursor?: PupilWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;

  @TypeGraphQL.Field(_type => [PupilScalarFieldEnum], {
    nullable: true
  })
  distinct?: Array<"id" | "createdAt" | "updatedAt" | "firstname" | "lastname" | "active" | "email" | "verification" | "wix_id" | "wix_creation_date" | "subjects" | "msg" | "grade" | "verifiedAt" | "authToken" | "authTokenUsed" | "authTokenSent" | "openMatchRequestCount" | "matchingPriority" | "schooltype" | "newsletter" | "isPupil" | "isParticipant" | "state" | "lastUpdatedSettingsViaBlocker" | "teacherEmailAddress" | "registrationSource" | "schoolId" | "isProjectCoachee" | "projectFields" | "isJufoParticipant" | "openProjectMatchRequestCount" | "projectMemberCount" | "languages" | "learningGermanSince"> | undefined;
}
