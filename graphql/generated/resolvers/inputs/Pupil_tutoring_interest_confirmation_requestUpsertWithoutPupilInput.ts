import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Pupil_tutoring_interest_confirmation_requestCreateWithoutPupilInput } from "../inputs/Pupil_tutoring_interest_confirmation_requestCreateWithoutPupilInput";
import { Pupil_tutoring_interest_confirmation_requestUpdateWithoutPupilInput } from "../inputs/Pupil_tutoring_interest_confirmation_requestUpdateWithoutPupilInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Pupil_tutoring_interest_confirmation_requestUpsertWithoutPupilInput {
  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestUpdateWithoutPupilInput, {
    nullable: false
  })
  update!: Pupil_tutoring_interest_confirmation_requestUpdateWithoutPupilInput;

  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestCreateWithoutPupilInput, {
    nullable: false
  })
  create!: Pupil_tutoring_interest_confirmation_requestCreateWithoutPupilInput;
}
