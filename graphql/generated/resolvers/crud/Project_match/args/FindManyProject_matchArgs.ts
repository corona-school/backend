import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Project_matchOrderByInput } from "../../../inputs/Project_matchOrderByInput";
import { Project_matchWhereInput } from "../../../inputs/Project_matchWhereInput";
import { Project_matchWhereUniqueInput } from "../../../inputs/Project_matchWhereUniqueInput";
import { Project_matchScalarFieldEnum } from "../../../../enums/Project_matchScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class FindManyProject_matchArgs {
  @TypeGraphQL.Field(_type => Project_matchWhereInput, {
    nullable: true
  })
  where?: Project_matchWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Project_matchOrderByInput], {
    nullable: true
  })
  orderBy?: Project_matchOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => Project_matchWhereUniqueInput, {
    nullable: true
  })
  cursor?: Project_matchWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;

  @TypeGraphQL.Field(_type => [Project_matchScalarFieldEnum], {
    nullable: true
  })
  distinct?: Array<"id" | "uuid" | "createdAt" | "updatedAt" | "dissolved" | "dissolveReason" | "studentId" | "pupilId"> | undefined;
}
