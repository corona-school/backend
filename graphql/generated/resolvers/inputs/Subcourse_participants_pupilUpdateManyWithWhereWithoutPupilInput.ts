import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_participants_pupilScalarWhereInput } from "../inputs/Subcourse_participants_pupilScalarWhereInput";
import { Subcourse_participants_pupilUpdateManyMutationInput } from "../inputs/Subcourse_participants_pupilUpdateManyMutationInput";

@TypeGraphQL.InputType("Subcourse_participants_pupilUpdateManyWithWhereWithoutPupilInput", {
  isAbstract: true
})
export class Subcourse_participants_pupilUpdateManyWithWhereWithoutPupilInput {
  @TypeGraphQL.Field(_type => Subcourse_participants_pupilScalarWhereInput, {
    nullable: false
  })
  where!: Subcourse_participants_pupilScalarWhereInput;

  @TypeGraphQL.Field(_type => Subcourse_participants_pupilUpdateManyMutationInput, {
    nullable: false
  })
  data!: Subcourse_participants_pupilUpdateManyMutationInput;
}
