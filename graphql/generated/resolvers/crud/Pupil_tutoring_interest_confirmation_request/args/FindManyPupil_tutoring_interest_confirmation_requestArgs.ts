import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Pupil_tutoring_interest_confirmation_requestOrderByWithRelationInput } from "../../../inputs/Pupil_tutoring_interest_confirmation_requestOrderByWithRelationInput";
import { Pupil_tutoring_interest_confirmation_requestWhereInput } from "../../../inputs/Pupil_tutoring_interest_confirmation_requestWhereInput";
import { Pupil_tutoring_interest_confirmation_requestWhereUniqueInput } from "../../../inputs/Pupil_tutoring_interest_confirmation_requestWhereUniqueInput";
import { Pupil_tutoring_interest_confirmation_requestScalarFieldEnum } from "../../../../enums/Pupil_tutoring_interest_confirmation_requestScalarFieldEnum";

@TypeGraphQL.ArgsType()
export class FindManyPupil_tutoring_interest_confirmation_requestArgs {
  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestWhereInput, {
    nullable: true
  })
  where?: Pupil_tutoring_interest_confirmation_requestWhereInput | undefined;

  @TypeGraphQL.Field(_type => [Pupil_tutoring_interest_confirmation_requestOrderByWithRelationInput], {
    nullable: true
  })
  orderBy?: Pupil_tutoring_interest_confirmation_requestOrderByWithRelationInput[] | undefined;

  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestWhereUniqueInput, {
    nullable: true
  })
  cursor?: Pupil_tutoring_interest_confirmation_requestWhereUniqueInput | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  take?: number | undefined;

  @TypeGraphQL.Field(_type => TypeGraphQL.Int, {
    nullable: true
  })
  skip?: number | undefined;

  @TypeGraphQL.Field(_type => [Pupil_tutoring_interest_confirmation_requestScalarFieldEnum], {
    nullable: true
  })
  distinct?: Array<"id" | "createdAt" | "updatedAt" | "status" | "token" | "reminderSentDate" | "pupilId"> | undefined;
}
