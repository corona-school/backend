import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateWithoutParticipation_certificateInput } from "../inputs/PupilCreateWithoutParticipation_certificateInput";
import { PupilUpdateWithoutParticipation_certificateInput } from "../inputs/PupilUpdateWithoutParticipation_certificateInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class PupilUpsertWithoutParticipation_certificateInput {
  @TypeGraphQL.Field(_type => PupilUpdateWithoutParticipation_certificateInput, {
    nullable: false
  })
  update!: PupilUpdateWithoutParticipation_certificateInput;

  @TypeGraphQL.Field(_type => PupilCreateWithoutParticipation_certificateInput, {
    nullable: false
  })
  create!: PupilCreateWithoutParticipation_certificateInput;
}
