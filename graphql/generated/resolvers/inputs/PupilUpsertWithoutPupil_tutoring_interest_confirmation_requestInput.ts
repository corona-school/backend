import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateWithoutPupil_tutoring_interest_confirmation_requestInput } from "../inputs/PupilCreateWithoutPupil_tutoring_interest_confirmation_requestInput";
import { PupilUpdateWithoutPupil_tutoring_interest_confirmation_requestInput } from "../inputs/PupilUpdateWithoutPupil_tutoring_interest_confirmation_requestInput";

@TypeGraphQL.InputType("PupilUpsertWithoutPupil_tutoring_interest_confirmation_requestInput", {
  isAbstract: true
})
export class PupilUpsertWithoutPupil_tutoring_interest_confirmation_requestInput {
  @TypeGraphQL.Field(_type => PupilUpdateWithoutPupil_tutoring_interest_confirmation_requestInput, {
    nullable: false
  })
  update!: PupilUpdateWithoutPupil_tutoring_interest_confirmation_requestInput;

  @TypeGraphQL.Field(_type => PupilCreateWithoutPupil_tutoring_interest_confirmation_requestInput, {
    nullable: false
  })
  create!: PupilCreateWithoutPupil_tutoring_interest_confirmation_requestInput;
}
