import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Pupil_tutoring_interest_confirmation_requestWhereInput } from "../../../inputs/Pupil_tutoring_interest_confirmation_requestWhereInput";

@TypeGraphQL.ArgsType()
export class DeleteManyPupil_tutoring_interest_confirmation_requestArgs {
  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestWhereInput, {
    nullable: true
  })
  where?: Pupil_tutoring_interest_confirmation_requestWhereInput | undefined;
}
