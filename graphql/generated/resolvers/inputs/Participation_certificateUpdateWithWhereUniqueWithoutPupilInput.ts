import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Participation_certificateUpdateWithoutPupilInput } from "../inputs/Participation_certificateUpdateWithoutPupilInput";
import { Participation_certificateWhereUniqueInput } from "../inputs/Participation_certificateWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Participation_certificateUpdateWithWhereUniqueWithoutPupilInput {
  @TypeGraphQL.Field(_type => Participation_certificateWhereUniqueInput, {
    nullable: false
  })
  where!: Participation_certificateWhereUniqueInput;

  @TypeGraphQL.Field(_type => Participation_certificateUpdateWithoutPupilInput, {
    nullable: false
  })
  data!: Participation_certificateUpdateWithoutPupilInput;
}
