import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Course_participation_certificateOrderByWithRelationInput } from "../../../inputs/Course_participation_certificateOrderByWithRelationInput";
import { Course_participation_certificateWhereInput } from "../../../inputs/Course_participation_certificateWhereInput";
import { Course_participation_certificateWhereUniqueInput } from "../../../inputs/Course_participation_certificateWhereUniqueInput";
import { Course_participation_certificateScalarFieldEnum } from "../../../../enums/Course_participation_certificateScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class PupilCourse_participation_certificateArgs {
  @TypeGraphQL.Field(_type => Course_participation_certificateWhereInput, {
    nullable: true
  })
  where?: Course_participation_certificateWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateOrderByWithRelationInput], {
    nullable: true
  })
  orderBy?: Course_participation_certificateOrderByWithRelationInput[] | undefined;

  @TypeGraphQL.Field(_type => Course_participation_certificateWhereUniqueInput, {
    nullable: true
  })
  cursor?: Course_participation_certificateWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;

  @TypeGraphQL.Field(_type => [Course_participation_certificateScalarFieldEnum], {
    nullable: true
  })
  distinct?: Array<"id" | "createdAt" | "updatedAt" | "issuerId" | "pupilId" | "subcourseId"> | undefined;
}
