import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Pupil_tutoring_interest_confirmation_requestCreateManyInput } from "../../../inputs/Pupil_tutoring_interest_confirmation_requestCreateManyInput";

@TypeGraphQL.ArgsType()
export class CreateManyPupil_tutoring_interest_confirmation_requestArgs {
  @TypeGraphQL.Field(_type => [Pupil_tutoring_interest_confirmation_requestCreateManyInput], {
    nullable: false
  })
  data!: Pupil_tutoring_interest_confirmation_requestCreateManyInput[];

  @TypeGraphQL.Field(_type => Boolean, {
    nullable: true
  })
  skipDuplicates?: boolean | undefined;
}
