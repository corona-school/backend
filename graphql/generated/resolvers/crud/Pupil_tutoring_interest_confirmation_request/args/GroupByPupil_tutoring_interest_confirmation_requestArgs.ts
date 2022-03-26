import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Pupil_tutoring_interest_confirmation_requestOrderByInput } from "../../../inputs/Pupil_tutoring_interest_confirmation_requestOrderByInput";
import { Pupil_tutoring_interest_confirmation_requestScalarWhereWithAggregatesInput } from "../../../inputs/Pupil_tutoring_interest_confirmation_requestScalarWhereWithAggregatesInput";
import { Pupil_tutoring_interest_confirmation_requestWhereInput } from "../../../inputs/Pupil_tutoring_interest_confirmation_requestWhereInput";
import { Pupil_tutoring_interest_confirmation_requestScalarFieldEnum } from "../../../../enums/Pupil_tutoring_interest_confirmation_requestScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class GroupByPupil_tutoring_interest_confirmation_requestArgs {
  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestWhereInput, {
    nullable: true
  })
  where?: Pupil_tutoring_interest_confirmation_requestWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Pupil_tutoring_interest_confirmation_requestOrderByInput], {
    nullable: true
  })
  orderBy?: Pupil_tutoring_interest_confirmation_requestOrderByInput[] | undefined;

  @TypeGraphQL.Field(_type => [Pupil_tutoring_interest_confirmation_requestScalarFieldEnum], {
    nullable: false
  })
  by!: Array<"id" | "createdAt" | "updatedAt" | "status" | "token" | "reminderSentDate" | "pupilId">;

  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestScalarWhereWithAggregatesInput, {
    nullable: true
  })
  having?: Pupil_tutoring_interest_confirmation_requestScalarWhereWithAggregatesInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;
}
