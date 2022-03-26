import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { Subcourse_waiting_list_pupilUpdateWithoutPupilInput } from "../inputs/Subcourse_waiting_list_pupilUpdateWithoutPupilInput";
import { Subcourse_waiting_list_pupilWhereUniqueInput } from "../inputs/Subcourse_waiting_list_pupilWhereUniqueInput";

@TypeGraphQL.InputType({
  isAbstract: true
})
export class Subcourse_waiting_list_pupilUpdateWithWhereUniqueWithoutPupilInput {
  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilWhereUniqueInput, {
    nullable: false
  })
  where!: Subcourse_waiting_list_pupilWhereUniqueInput;

  @TypeGraphQL.Field(_type => Subcourse_waiting_list_pupilUpdateWithoutPupilInput, {
    nullable: false
  })
  data!: Subcourse_waiting_list_pupilUpdateWithoutPupilInput;
}
