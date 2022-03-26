import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { MentorOrderByInput } from "../../../inputs/MentorOrderByInput";
import { MentorScalarWhereWithAggregatesInput } from "../../../inputs/MentorScalarWhereWithAggregatesInput";
import { MentorWhereInput } from "../../../inputs/MentorWhereInput";
import { MentorScalarFieldEnum } from "../../../../enums/MentorScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByMentorArgs {
  @TypeGraphQL.Field(_type => MentorWhereInput, {
    nullable: true
  })
  where?: MentorWhereInput | undefined;

  @TypeGraphQL.Field(_type => [MentorOrderByInput], {
    nullable: true
  })
  orderBy?: MentorOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => [MentorScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "createdAt" | "updatedAt" | "firstname" | "lastname" | "active" | "email" | "verification" | "verifiedAt" | "authToken" | "authTokenUsed" | "authTokenSent" | "wix_id" | "wix_creation_date" | "division" | "expertise" | "subjects" | "teachingExperience" | "message" | "description" | "imageUrl">;

  @TypeGraphQL.Field(_type => MentorScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: MentorScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
