import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_participants_pupilUpdateWithoutPupilInput } from "../inputs/Subcourse_participants_pupilUpdateWithoutPupilInput";
import { Subcourse_participants_pupilWhereUniqueInput } from "../inputs/Subcourse_participants_pupilWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Subcourse_participants_pupilUpdateWithWhereUniqueWithoutPupilInput {
  @TypeGraphQL.Field(_type => Subcourse_participants_pupilWhereUniqueInput, {
    nullable: false
  })
  where!: Subcourse_participants_pupilWhereUniqueInput;

  @TypeGraphQL.Field(_type => Subcourse_participants_pupilUpdateWithoutPupilInput, {
    nullable: false
  })
  data!: Subcourse_participants_pupilUpdateWithoutPupilInput;
}
