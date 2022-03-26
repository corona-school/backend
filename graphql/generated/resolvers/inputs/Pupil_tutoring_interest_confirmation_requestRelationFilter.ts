import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Pupil_tutoring_interest_confirmation_requestWhereInput } from "../inputs/Pupil_tutoring_interest_confirmation_requestWhereInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Pupil_tutoring_interest_confirmation_requestRelationFilter {
  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestWhereInput, {
    nullable: true
  })
  is?: Pupil_tutoring_interest_confirmation_requestWhereInput | undefined;

  @TypeGraphQL.Field(_type => Pupil_tutoring_interest_confirmation_requestWhereInput, {
    nullable: true
  })
  isNot?: Pupil_tutoring_interest_confirmation_requestWhereInput | undefined;
}
