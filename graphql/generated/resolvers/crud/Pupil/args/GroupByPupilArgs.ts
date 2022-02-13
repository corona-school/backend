import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { PupilOrderByInput } from "../../../inputs/PupilOrderByInput";
import { PupilScalarWhereWithAggregatesInput } from "../../../inputs/PupilScalarWhereWithAggregatesInput";
import { PupilWhereInput } from "../../../inputs/PupilWhereInput";
import { PupilScalarFieldEnum } from "../../../../enums/PupilScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByPupilArgs {
  @TypeGraphQL.Field(_type => PupilWhereInput, {
    nullable: true
  })
  where?: PupilWhereInput | undefined;

  @TypeGraphQL.Field(_type => [PupilOrderByInput], {
    nullable: true
  })
  orderBy?: PupilOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => [PupilScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "createdAt" | "updatedAt" | "firstname" | "lastname" | "active" | "email" | "verification" | "verifiedAt" | "authToken" | "authTokenUsed" | "authTokenSent" | "wix_id" | "wix_creation_date" | "state" | "schooltype" | "msg" | "grade" | "newsletter" | "isPupil" | "subjects" | "openMatchRequestCount" | "isParticipant" | "isProjectCoachee" | "projectFields" | "isJufoParticipant" | "openProjectMatchRequestCount" | "projectMemberCount" | "languages" | "learningGermanSince" | "matchingPriority" | "lastUpdatedSettingsViaBlocker" | "teacherEmailAddress" | "registrationSource" | "coduToken" | "schoolId">;

  @TypeGraphQL.Field(_type => PupilScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: PupilScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
