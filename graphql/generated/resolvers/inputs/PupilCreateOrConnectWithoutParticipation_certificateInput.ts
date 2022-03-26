import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateWithoutParticipation_certificateInput } from "../inputs/PupilCreateWithoutParticipation_certificateInput";
import { PupilWhereUniqueInput } from "../inputs/PupilWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class PupilCreateOrConnectWithoutParticipation_certificateInput {
  @TypeGraphQL.Field(_type => PupilWhereUniqueInput, {
    nullable: false
  })
  where!: PupilWhereUniqueInput;

  @TypeGraphQL.Field(_type => PupilCreateWithoutParticipation_certificateInput, {
    nullable: false
  })
  create!: PupilCreateWithoutParticipation_certificateInput;
}
