import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateOrConnectWithoutPupil_tutoring_interest_confirmation_requestInput } from "../inputs/PupilCreateOrConnectWithoutPupil_tutoring_interest_confirmation_requestInput";
import { PupilCreateWithoutPupil_tutoring_interest_confirmation_requestInput } from "../inputs/PupilCreateWithoutPupil_tutoring_interest_confirmation_requestInput";
import { PupilWhereUniqueInput } from "../inputs/PupilWhereUniqueInput";

@TypeGraphQL.InputType("PupilCreateNestedOneWithoutPupil_tutoring_interest_confirmation_requestInput", {
  isAbstract: true
})
export class PupilCreateNestedOneWithoutPupil_tutoring_interest_confirmation_requestInput {
  @TypeGraphQL.Field(_type => PupilCreateWithoutPupil_tutoring_interest_confirmation_requestInput, {
    nullable: true
  })
  create?: PupilCreateWithoutPupil_tutoring_interest_confirmation_requestInput | undefined;

  @TypeGraphQL.Field(_type => PupilCreateOrConnectWithoutPupil_tutoring_interest_confirmation_requestInput, {
    nullable: true
  })
  connectOrCreate?: PupilCreateOrConnectWithoutPupil_tutoring_interest_confirmation_requestInput | undefined;

  @TypeGraphQL.Field(_type => PupilWhereUniqueInput, {
    nullable: true
  })
  connect?: PupilWhereUniqueInput | undefined;
}
