import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Participation_certificateCreateWithoutPupilInput } from "../inputs/Participation_certificateCreateWithoutPupilInput";
import { Participation_certificateWhereUniqueInput } from "../inputs/Participation_certificateWhereUniqueInput";

@TypeGraphQL.InputType("Participation_certificateCreateOrConnectWithoutPupilInput", {
  isAbstract: true
})
export class Participation_certificateCreateOrConnectWithoutPupilInput {
  @TypeGraphQL.Field(_type => Participation_certificateWhereUniqueInput, {
    nullable: false
  })
  where!: Participation_certificateWhereUniqueInput;

  @TypeGraphQL.Field(_type => Participation_certificateCreateWithoutPupilInput, {
    nullable: false
  })
  create!: Participation_certificateCreateWithoutPupilInput;
}
