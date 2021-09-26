import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Pupil_tutoring_interest_confirmation_requestUpdateManyMutationInput } from "../../../inputs/Pupil_tutoring_interest_confirmation_requestUpdateManyMutationInput";
import { Pupil_tutoring_interest_confirmation_requestWhereInput } from "../../../inputs/Pupil_tutoring_interest_confirmation_requestWhereInput";

@TypeGraphQL.ArgsType()
export class UpdateManyPupil_tutoring_interest_confirmation_requestArgs {
  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestUpdateManyMutationInput, {
    nullable: false
  })
  data!: Pupil_tutoring_interest_confirmation_requestUpdateManyMutationInput;

  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestWhereInput, {
    nullable: true
  })
  where?: Pupil_tutoring_interest_confirmation_requestWhereInput | undefined;
}
