import * as TypeGraphQL from "type-graphql";
import * as GraphQLScalars from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { DecimalJSScalar } from "../../scalars";
import { PupilCreateWithoutSubcourse_waiting_list_pupilInput } from "../inputs/PupilCreateWithoutSubcourse_waiting_list_pupilInput";
import { PupilWhereUniqueInput } from "../inputs/PupilWhereUniqueInput";

@TypeGraphQL.InputType("PupilCreateOrConnectWithoutSubcourse_waiting_list_pupilInput", {
  isAbstract: true
})
export class PupilCreateOrConnectWithoutSubcourse_waiting_list_pupilInput {
  @TypeGraphQL.Field(_type => PupilWhereUniqueInput, {
    nullable: false
  })
  where!: PupilWhereUniqueInput;

  @TypeGraphQL.Field(_type => PupilCreateWithoutSubcourse_waiting_list_pupilInput, {
    nullable: false
  })
  create!: PupilCreateWithoutSubcourse_waiting_list_pupilInput;
}
