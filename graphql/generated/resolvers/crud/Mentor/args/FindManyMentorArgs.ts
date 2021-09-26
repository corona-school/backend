import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { MentorOrderByInput } from "../../../inputs/MentorOrderByInput";
import { MentorWhereInput } from "../../../inputs/MentorWhereInput";
import { MentorWhereUniqueInput } from "../../../inputs/MentorWhereUniqueInput";
import { MentorScalarFieldEnum } from "../../../../enums/MentorScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class FindManyMentorArgs {
  @TypeGraphQL.Field(_type => MentorWhereInput, {
    nullable: true
  })
  where?: MentorWhereInput | undefined;

  @TypeGraphQL.Field(_type => [MentorOrderByInput], {
    nullable: true
  })
  orderBy?: MentorOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => MentorWhereUniqueInput, {
    nullable: true
  })
  cursor?: MentorWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;

  @TypeGraphQL.Field(_type => [MentorScalarFieldEnum], {
    nullable: true
  })
  distinct?: Array<"id" | "createdAt" | "updatedAt" | "firstname" | "lastname" | "active" | "email" | "verification" | "verifiedAt" | "authToken" | "authTokenUsed" | "authTokenSent" | "wix_id" | "wix_creation_date" | "division" | "expertise" | "subjects" | "teachingExperience" | "message" | "description" | "imageUrl"> | undefined;
}
