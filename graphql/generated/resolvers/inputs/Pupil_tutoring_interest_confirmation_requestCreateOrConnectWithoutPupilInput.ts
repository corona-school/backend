import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Pupil_tutoring_interest_confirmation_requestCreateWithoutPupilInput } from "../inputs/Pupil_tutoring_interest_confirmation_requestCreateWithoutPupilInput";
import { Pupil_tutoring_interest_confirmation_requestWhereUniqueInput } from "../inputs/Pupil_tutoring_interest_confirmation_requestWhereUniqueInput";

@TypeGraphQL.InputType("Pupil_tutoring_interest_confirmation_requestCreateOrConnectWithoutPupilInput", {
  isAbstract: true
})
export class Pupil_tutoring_interest_confirmation_requestCreateOrConnectWithoutPupilInput {
  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestWhereUniqueInput, {
    nullable: false
  })
  where!: Pupil_tutoring_interest_confirmation_requestWhereUniqueInput;

  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestCreateWithoutPupilInput, {
    nullable: false
  })
  create!: Pupil_tutoring_interest_confirmation_requestCreateWithoutPupilInput;
}
