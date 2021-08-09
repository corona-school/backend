import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Pupil_tutoring_interest_confirmation_requestCreateInput } from "../../../inputs/Pupil_tutoring_interest_confirmation_requestCreateInput";

@TypeGraphQL.ArgsType()
export class CreatePupil_tutoring_interest_confirmation_requestArgs {
  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestCreateInput, {
    nullable: false
  })
  data!: Pupil_tutoring_interest_confirmation_requestCreateInput;
}
