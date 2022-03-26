import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Participation_certificateOrderByWithAggregationInput } from "../../../inputs/Participation_certificateOrderByWithAggregationInput";
import { Participation_certificateScalarWhereWithAggregatesInput } from "../../../inputs/Participation_certificateScalarWhereWithAggregatesInput";
import { Participation_certificateWhereInput } from "../../../inputs/Participation_certificateWhereInput";
import { Participation_certificateScalarFieldEnum } from "../../../../enums/Participation_certificateScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByParticipation_certificateArgs {
  @TypeGraphQL.Field(_type => Participation_certificateWhereInput, {
    nullable: true
  })
  where?: Participation_certificateWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Participation_certificateOrderByWithAggregationInput], {
    nullable: true
  })
  orderBy?: Participation_certificateOrderByWithAggregationInput[] | undefined;

  @TypeGraphQL.Field(_type => [Participation_certificateScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "uuid" | "subjects" | "categories" | "certificateDate" | "startDate" | "endDate" | "hoursPerWeek" | "hoursTotal" | "medium" | "ongoingLessons" | "state" | "signaturePupil" | "signatureParent" | "signatureLocation" | "signatureDate" | "studentId" | "pupilId">;

  @TypeGraphQL.Field(_type => Participation_certificateScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: Participation_certificateScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
