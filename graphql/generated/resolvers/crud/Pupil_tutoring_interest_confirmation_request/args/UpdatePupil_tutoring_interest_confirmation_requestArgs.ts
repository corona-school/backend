import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Pupil_tutoring_interest_confirmation_requestUpdateInput } from "../../../inputs/Pupil_tutoring_interest_confirmation_requestUpdateInput";
import { Pupil_tutoring_interest_confirmation_requestWhereUniqueInput } from "../../../inputs/Pupil_tutoring_interest_confirmation_requestWhereUniqueInput";

@TypeGraphQL.ArgsType()
export class UpdatePupil_tutoring_interest_confirmation_requestArgs {
  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestUpdateInput, {
    nullable: false
  })
  data!: Pupil_tutoring_interest_confirmation_requestUpdateInput;

  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestWhereUniqueInput, {
    nullable: false
  })
  where!: Pupil_tutoring_interest_confirmation_requestWhereUniqueInput;
}
