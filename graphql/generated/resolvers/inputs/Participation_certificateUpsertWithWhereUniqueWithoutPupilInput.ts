import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Participation_certificateCreateWithoutPupilInput } from "../inputs/Participation_certificateCreateWithoutPupilInput";
import { Participation_certificateUpdateWithoutPupilInput } from "../inputs/Participation_certificateUpdateWithoutPupilInput";
import { Participation_certificateWhereUniqueInput } from "../inputs/Participation_certificateWhereUniqueInput";

@TypeGraphQL.InputType("Participation_certificateUpsertWithWhereUniqueWithoutPupilInput", {
  isAbstract: true
})
export class Participation_certificateUpsertWithWhereUniqueWithoutPupilInput {
  @TypeGraphQL.Field(_type => Participation_certificateWhereUniqueInput, {
    nullable: false
  })
  where!: Participation_certificateWhereUniqueInput;

  @TypeGraphQL.Field(_type => Participation_certificateUpdateWithoutPupilInput, {
    nullable: false
  })
  update!: Participation_certificateUpdateWithoutPupilInput;

  @TypeGraphQL.Field(_type => Participation_certificateCreateWithoutPupilInput, {
    nullable: false
  })
  create!: Participation_certificateCreateWithoutPupilInput;
}
