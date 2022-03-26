import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateNestedOneWithoutPupil_tutoring_interest_confirmation_requestInput } from "../inputs/PupilCreateNestedOneWithoutPupil_tutoring_interest_confirmation_requestInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Pupil_tutoring_interest_confirmation_requestCreateInput {
  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  createdAt?: Date | undefined;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  updatedAt?: Date | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: true
  })
  status?: string | undefined;

  @TypeGraphQL.Field(_type => String, {
    nullable: false
  })
  token!: string;

  @TypeGraphQL.Field(_type => Date, {
    nullable: true
  })
  reminderSentDate?: Date | undefined;

  @TypeGraphQL.Field(_type => PupilCreateNestedOneWithoutPupil_tutoring_interest_confirmation_requestInput, {
    nullable: true
  })
  pupil?: PupilCreateNestedOneWithoutPupil_tutoring_interest_confirmation_requestInput | undefined;
}
