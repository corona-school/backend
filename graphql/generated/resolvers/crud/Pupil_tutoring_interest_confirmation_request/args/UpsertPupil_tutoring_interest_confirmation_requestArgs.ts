import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Pupil_tutoring_interest_confirmation_requestCreateInput } from "../../../inputs/Pupil_tutoring_interest_confirmation_requestCreateInput";
import { Pupil_tutoring_interest_confirmation_requestUpdateInput } from "../../../inputs/Pupil_tutoring_interest_confirmation_requestUpdateInput";
import { Pupil_tutoring_interest_confirmation_requestWhereUniqueInput } from "../../../inputs/Pupil_tutoring_interest_confirmation_requestWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpsertPupil_tutoring_interest_confirmation_requestArgs {
  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestWhereUniqueInput, {
    nullable: false
  })
  where!: Pupil_tutoring_interest_confirmation_requestWhereUniqueInput;

  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestCreateInput, {
    nullable: false
  })
  create!: Pupil_tutoring_interest_confirmation_requestCreateInput;

  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestUpdateInput, {
    nullable: false
  })
  update!: Pupil_tutoring_interest_confirmation_requestUpdateInput;
}
