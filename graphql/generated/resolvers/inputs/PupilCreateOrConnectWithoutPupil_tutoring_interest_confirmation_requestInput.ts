import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateWithoutPupil_tutoring_interest_confirmation_requestInput } from "../inputs/PupilCreateWithoutPupil_tutoring_interest_confirmation_requestInput";
import { PupilWhereUniqueInput } from "../inputs/PupilWhereUniqueInput";

@TypeGraphQL.InputType("PupilCreateOrConnectWithoutPupil_tutoring_interest_confirmation_requestInput", {
  isAbstract: true
})
export class PupilCreateOrConnectWithoutPupil_tutoring_interest_confirmation_requestInput {
  @TypeGraphQL.Field(_type => PupilWhereUniqueInput, {
    nullable: false
  })
  where!: PupilWhereUniqueInput;

  @TypeGraphQL.Field(_type => PupilCreateWithoutPupil_tutoring_interest_confirmation_requestInput, {
    nullable: false
  })
  create!: PupilCreateWithoutPupil_tutoring_interest_confirmation_requestInput;
}
