import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateWithoutSubcourse_participants_pupilInput } from "../inputs/PupilCreateWithoutSubcourse_participants_pupilInput";
import { PupilWhereUniqueInput } from "../inputs/PupilWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class PupilCreateOrConnectWithoutSubcourse_participants_pupilInput {
  @TypeGraphQL.Field(_type => PupilWhereUniqueInput, {
    nullable: false
  })
  where!: PupilWhereUniqueInput;

  @TypeGraphQL.Field(_type => PupilCreateWithoutSubcourse_participants_pupilInput, {
    nullable: false
  })
  create!: PupilCreateWithoutSubcourse_participants_pupilInput;
}
