import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_participation_certificateOrderByInput } from "../../../inputs/Course_participation_certificateOrderByInput";
import { Course_participation_certificateScalarWhereWithAggregatesInput } from "../../../inputs/Course_participation_certificateScalarWhereWithAggregatesInput";
import { Course_participation_certificateWhereInput } from "../../../inputs/Course_participation_certificateWhereInput";
import { Course_participation_certificateScalarFieldEnum } from "../../../../enums/Course_participation_certificateScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByCourse_participation_certificateArgs {
  @TypeGraphQL.Field(_type => Course_participation_certificateWhereInput, {
    nullable: true
  })
  where?: Course_participation_certificateWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateOrderByInput], {
    nullable: true
  })
  orderBy?: Course_participation_certificateOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "createdAt" | "updatedAt" | "issuerId" | "pupilId" | "subcourseId">;

  @TypeGraphQL.Field(_type => Course_participation_certificateScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: Course_participation_certificateScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
